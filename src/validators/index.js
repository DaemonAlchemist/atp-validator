/**
 * Created by Andy on 8/29/2017.
 */

import {error, validate} from "atp-validator";

export default {
    minLength: (val, len, name) => validate(
        val.length >= len,
        name + ' must be at least ' + len + ' characters',
        400
    ),
    isAlphaNumeric: (val, name) => validate(
        val.match(/^[a-zA-Z0-9 ]*$/) !== null,
        name + ' must contain only letters and numbers',
        400
    ),
    isInteger: (val, name) => validate(
        Number.isInteger(val),
        name + ' must be an integer',
        400
    ),
    required: (val, name) => validate(
        val !== null && val !== "" && typeof val !== 'undefined',
        name + ' is required',
        400
    )
}
