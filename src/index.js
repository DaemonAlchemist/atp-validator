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
    }

    //Usage:  validate().orDie()...
    orDie() {
        this._continueOnFailure = false;
        return this;
    }

    //Usage:  validate().all()...
    all() {
        this._continueOnFailure = true;
        return this;
    }

    run(validator, args) {
        if(this.valid || this._continueOnFailure) {
            const result = this.validators[validator](...args);
            if(result !== true) {
                this.valid = false;
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
