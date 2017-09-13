/**
 * Created by Andrea on 8/27/2017.
 */

import config from 'atp-config';
import validators from './validators/index';
import validate from './validate';
import error from './error';
import {o} from 'atp-sugar';

config.setDefaults({validators});

class Validator
{
    constructor() {
        this.validators = config.get('validators');
        this.errors = [];
        this.currentSet = "";
        this.validatorSets = {};
        this.validatorChains = {};
        this.for("default");
    }

    for(name) {
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

    optional(value, callback) {
        return validate(
            (resolve, reject) => {
                if(typeof value === 'undefined') {
                    resolve();
                } else {
                    callback(validator(), value).then(
                        resolve,
                        errors => {reject(errors);}
                    );
                }
            },
            "",
            200
        )
    }

    if(names) {
        this.current().dependencies = [].concat(names);
        this.current().dependencyType = "all";
        return this;
    }

    any(names) {
        this.current().dependencies = [].concat(names);
        this.current().dependencyType = "any";
        return this;
    }
    
    enqueueValidator(name, args) {
        this.current().validators.push(() => new Promise((resolve, reject) => {
            (typeof this.validators[name] !== 'undefined'
                ? this.validators[name]
                : () => validate(false, "Missing validator " + name, 500)
            )(...args)
                .then(resolve)
                .catch(errors => {
                    if(!this.current().suppressErrors) {
                        this.errors = this.errors.concat(errors);
                    }
                    reject();
                });
        }));
    }

    build() {
        o(this.validatorSets).filter(set => set.validators.length === 0).map((set, key) => {
            const origKey = this.currentSet;
            this.for(key).pass();
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
                        //TODO:  Handle 'any' condition rather than 'all'
                        Promise.all(set.dependencies.map(name => this.validatorChains[name]()))
                            .then(() => {oldChain().then(resolve, reject);})
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
    const validatorBase = new Validator();

    const validator = new Proxy(validatorBase, {
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
