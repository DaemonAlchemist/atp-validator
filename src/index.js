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
        this.chain("default");
    }

    reset(name, continueOnFailure) {
        this.currentSet = name;
        this.validatorSets[name] = {
            type: continueOnFailure ? "all" : "chain",
            dependencies: [],
            validators: []
        };
        return this;
    }

    chain(name) {
        return this.reset(name, false);
    }

    all(name) {
        return this.reset(name, true);
    }

    if(names) {
        this.validatorSets[this.currentSet].dependencies = names;
        return this;
    }

    enqueueValidator(name, args) {
        this.validatorSets[this.currentSet].validators.push(() => new Promise((resolve, reject) => {
            this.validators[name](...args)
                .then(resolve)
                .catch(errors => {
                    this.errors = this.errors.concat(errors);
                    reject();
                });
        }));
    }

    build() {
        this.validatorChains = o(this.validatorSets)
            .filter(set => set.validators.length > 0)
            .reduce((combined, set, key) => {
                let setChain = set.type === 'all'
                    ? () => Promise.all(set.validators.map(val => val()))
                    : set.validators.reduce((chain, validator) => () => new Promise((resolve, reject) => {
                        chain().then(() => {validator().then(resolve, reject);}).catch(reject)
                    }));

                if(set.dependencies.length > 0) {
                    const oldChain = setChain;
                    setChain = () => new Promise((resolve, reject) => {
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

export default () => {
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
