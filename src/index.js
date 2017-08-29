/**
 * Created by Andrea on 8/27/2017.
 */

import config from 'atp-config';

class Validator
{
    constructor(request) {
        this.request = request;
        this.validators = config.get('validators');
        this._continueOnFailure = false;
        this.valid = true;
        this.errors = [];
    }

    stopOnFailure() {
        this._continueOnFailure = false;
        return this;
    }

    continueOnFailure() {
        this._continueOnFailure = true;
        return this;
    }

    run(validator, args) {
        if(!this.valid && !this._continueOnFailure) return this;

        const result = this.validators[validator]([this.request, ...args]);
        if(result !== true) {
            this.valid = false;
            this.errors = this.errors.concat(result);
        }
    }

    then(resolve = () => {}, reject = () => {}) {
        console.log("Resolving validator " + this.valid);
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
                console.log("Running validator " + property);
                target.run(property, [...arguments]);
                return validator;
            };
        }
    });

    return validator;
};
