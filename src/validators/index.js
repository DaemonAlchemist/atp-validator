/**
 * Created by Andy on 8/29/2017.
 */

import validate from '../validate';
import validator from "atp-validator";

export default {
    custom: v => v,
    minLength: (val, name, len) => validate(
        val.length >= len,
        name + ' must be at least ' + len + ' characters',
        400
    ),
    matches: (val, pattern, msg) => validate(
        pattern.test(val),
        msg,
        400
    ),
    isAlphaNumeric: (val, name) => validate(
        ["string", "number"].includes(typeof val) && /^[a-zA-Z0-9]*$/.test(val),
        name + ' must contain only letters and numbers',
        400
    ),
    isInteger: (val, name) => validate(
        Number.isInteger(val) || /^[0-9]+$/.test(val),
        name + ' must be an integer',
        400
    ),
    isOneOf: (val, values, name) => validate(
        values.includes(val),
        name + " must be one of " + JSON.stringify(values),
        400
    ),
    required: (val, name) => validate(
        val !== null && val !== "" && typeof val !== 'undefined',
        name + ' is required',
        400
    ),
    missing: (val, name) => validate(
        typeof val === 'undefined',
        name + " should not be set",
        400
    ),
    greaterThan: (val, name, threshold) => validate(
        val > threshold,
        name + " must be greater than " + threshold,
        400
    ),
    lessThan: (val, name, threshold) => validate(
        val < threshold,
        name + " must be less than " + threshold,
        400
    ),
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
    pass: () => validate(true, "", 200)
}
