/**
 * Created by Andrea on 8/27/2017.
 */

import config from 'atp-config';
import validators from './validators/index';
import validate from './validate';
import error from './error';

config.setDefaults({validators});

class Validator
{
    constructor() {
        this.validators = config.get('validators');
        this._continueOnFailure = false;
        this.valid = true;
        this.errors = [];
        this.status = {};
        this.currentSet = "";
        this.dependenciesValid = true;
    }

    reset(name, continueOnFailure) {
        this._continueOnFailure = continueOnFailure;
        this.valid = true;
        this.currentSet = name;
        this.status[name] = true;
        this.dependenciesValid = true;
        return this;
    }

    //Usage:  validate().orDie()...
    chain(name) {
        return this.reset(name, false);
    }

    //Usage:  validate().all()...
    all(name) {
        return this.reset(name, true);
    }

    if(names) {
        this.valid = this.status[this.currentSet] = this.dependenciesValid = names.reduce(
            (valid, name) => valid && typeof this.status[name] !== 'undefined' && this.status[name],
            true
        );
        return this;
    }

    run(validator, args) {
        if(this.dependenciesValid && (this.valid || this._continueOnFailure)) {
            console.log(validator);
            const result = this.validators[validator](...args);
            if(result !== true) {
                this.valid = false;
                this.status[this.currentSet] = false;
                this.errors = this.errors.concat(result);
            }
        }
    }

    then(resolve = () => {}, reject = () => {}) {
        this.valid ? resolve() : reject(this.errors);
        return this;
    }

    catch(reject = () => {}) {
        if(!this.valid) reject(this.errors);
        return this;
    }
}

export default () => {
    const validatorBase = new Validator();

    const validator = new Proxy(validatorBase, {
        get: (target, property, reciever) => {
            return property in target ? target[property] : function() {
                target.run(property, [...arguments]);
                return validator;
            };
        }
    });

    return validator;
};

export {error, validate};
