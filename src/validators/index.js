
import validate from '../validate';
import validator from "../index";

export default {
    /**
     * Validator: Define an inline custom validator.  Useful when you have a one-off validation and don't want to register a new validator
     * @param {ValidatorObject} v
     */
    custom: v => v,
    /**
     * Validator: Ensures that the given value has a minimum length
     * @param {String} val - The value to check
     * @param {String} name - Name of the value to display in error messages
     * @param {Integer} len - The minimum allowed length for the value
     */
    minLength: (val, name, len) => validate(
        val.length >= len,
        name + ' must be at least ' + len + ' characters',
        400
    ),
    /**
     * Validator: Ensures that the given value matches the given regular expression
     * @param {String} val - The value to check
     * @param {Regex} pattern - The pattern to check the value against
     * @param {String} msg - The message to display if the validation fails
     */
    matches: (val, pattern, msg) => validate(
        pattern.test(val),
        msg,
        400
    ),
    /**
     * Validator: Ensures that the given value contains only letters and/or numbers
     * @param {String} val - The value to check
     * @param {String} name - The name of the value to diplay in error messages
     */
    isAlphaNumeric: (val, name) => validate(
        ["string", "number"].includes(typeof val) && /^[a-zA-Z0-9]*$/.test(val),
        name + ' must contain only letters and numbers',
        400
    ),
    /**
     * Validator: Ensures that the given value is an integer
     * @param {Any} val - The value to check
     * @param {String} name - The name of the value to display in error messages
     */
    isInteger: (val, name) => validate(
        Number.isInteger(val) || /^[0-9]+$/.test(val),
        name + ' must be an integer',
        400
    ),
    /**
     * Validator: Ensures that the given value is one of a set of values
     * @param {Any} val - The value to check
     * @param {Array} values - A list of the allowed values
     * @param {String} name - The name of the value to display in error messages
     */
    isOneOf: (val, values, name) => validate(
        values.includes(val),
        name + " must be one of " + JSON.stringify(values),
        400
    ),
    /**
     * Validator: Ensures that the given value has a value
     * @param {Any} val - The value to check
     * @param {String} name - The name of the value to display in error messages
     */
    required: (val, name) => validate(
        val !== null && val !== "" && typeof val !== 'undefined',
        name + ' is required',
        400
    ),
    /**
     * Validator: Ensures that the given value does not exist
     * @param {Any} val - The value to check
     * @param {String} name - The name of the value to display in error messages
     */
    missing: (val, name) => validate(
        typeof val === 'undefined',
        name + " should not be set",
        400
    ),
    /**
     * Validator:  Ensures that the given value is greater than a set value
     * @param {Number} val - The value to check
     * @param {String} name - The name of the value to display in error messages
     * @param {Number} threshold - The minimum allowed value
     */
    greaterThan: (val, name, threshold) => validate(
        val > threshold,
        name + " must be greater than " + threshold,
        400
    ),
    /**
     * Validator:  Ensures that the given value is less than a set value
     * @param {Number} val - The value to check
     * @param {String} name - The name of the value to display in error messages
     * @param {Number} threshold - The maximum allowed value
     */
    lessThan: (val, name, threshold) => validate(
        val < threshold,
        name + " must be less than " + threshold,
        400
    ),
    /**
     * Validator: Shows that a value is optional, and only runs validators on it if actually present
     * @param {Any} value - The value to check
     * @param {Function} callback - Provides a validator as the only argument, and should return the validator after adding any needed validations.  These validations will only run if the given value is present.
     */
    isOptional: (value, callback) => validate(
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
    ),
    /**
     * Validator:  Placeholder validator that always passes.
     */
    pass: () => validate(true, "", 200)
}
