/**
 * Created by Andrea on 8/27/2017.
 */

import config from 'atp-config';
import validators from './validators/index';
import validate from './validate';
import error from './error';
import {o} from 'atp-sugar';
import typeOf from 'typeof';
import Promise from 'bluebird';

export const addValidators = validators => {
    config.setDefaults({validators});
}

addValidators(validators);

class Validator
{
    constructor() {
        this.validators = config.get('validators');
        this.errors = [];
        this.currentSet = "";
        this.validatorSets = {};
        this.validatorChains = {};
        this.check("default");
    }

    check(name) {
        this.currentSet = name;
        this.validatorSets[name] = {
            continueOnFailure: false,
            suppressErrors: false,
            dependencies: [],
            validators: []
        };
        return this;
    }

    inSeries() {
        this.current().continueOnFailure = false;
        return this;
    }

    inParallel() {
        this.current().continueOnFailure = true;
        return this;
    }

    silence() {
        this.current().suppressErrors = true;
        return this;
    }

    unsilence() {
        this.current().suppressErrors = true;
        return this;
    }

    current() {
        return this.validatorSets[this.currentSet];
    }

    if(names) {
        this.current().dependencies = [].concat(names);
        this.current().dependencyType = "all";
        return this;
    }

    ifAny(names) {
        this.current().dependencies = [].concat(names);
        this.current().dependencyType = "any";
        return this;
    }

    validateErrors(errors) {
        return typeOf(errors) === 'object' && errors.code && errors.msg ||
                typeOf(errors) === 'array' && errors.reduce((result, e) => result && this.validateErrors(e), true);
    }
    
    enqueueValidator(name, args) {
        this.current().validators.push(() => new Promise((resolve, reject) => {
            (typeof this.validators[name] === 'undefined' ? () => validate(false, "Missing validator " + name, 500) :
             typeof this.validators[name] !== 'function'  ? () => validate(false, "Invalid validator " + name, 500) :
                                                            this.validators[name]
            )(...args)
                .then(resolve)
                .catch(errors => {
                    if(this.validateErrors(errors)) {
                        if(!this.current().suppressErrors) {
                            this.errors = this.errors.concat(errors);
                        }
                    } else {
                        this.errors = this.errors.concat({
                            code: 500,
                            msg: "There was a problem with the " + name + " validator: "
                                + (errors.toString ? errors.toString() : JSON.stringify(errors))
                        });
                    }
                    reject();
                });
        }));
    }

    build() {
        o(this.validatorSets).filter(set => set.validators.length === 0).map((set, key) => {
            const origKey = this.currentSet;
            this.check(key).pass();
            this.currentSet = origKey;
        });

        this.validatorChains = o(this.validatorSets)
            .filter(set => set.validators.length > 0)
            .reduce((combined, set, key) => {
                let setChain = set.continueOnFailure
                    ? () => Promise.all(set.validators.map(val => val()))
                    : set.validators.reduce((chain, validator) => () => new Promise((resolve, reject) => {
                        chain().then(() => {validator().then(resolve, reject);}).catch(reject)
                    }));

                if(set.dependencies.length > 0) {
                    const oldChain = setChain;
                    setChain = () => new Promise((resolve, reject) => {
                        const f = set.dependencyType === 'all' ? Promise.all : Promise.any;
                        f(set.dependencies.map(name => this.validatorChains[name]()))
                            .then(() => {
                                this.errors = [];
                                oldChain().then(resolve, reject);
                            })
                            .catch(reject);
                    });
                }

                return combined.merge({[key]: setChain});
            }, o({})).raw;
    }

    then(resolve = () => {}, reject = () => {}) {
        this.build();
        this.validatorChains[this.currentSet]().then(resolve, () => reject(this.errors));
        return this;
    }
}

export default function validator() {
    const validator = new Proxy(new Validator(), {
        get: (target, property, reciever) => {
            return property in target ? target[property] : function() {
                target.enqueueValidator(property, [...arguments]);
                return validator;
            };
        }
    });

    return validator;
};

export {error, validate};
