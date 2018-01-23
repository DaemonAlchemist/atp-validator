
import error from "./error";
import {o} from 'atp-sugar';

/**
 * Create a custom validator test
 * @param {Boolean|Function|Promise} test - The test to run for this validator.  Can be either a pre-calculated boolean, a Promise function, or a Promise object
 * @param {String} msg - The error message to show if the test fails
 * @param {Integer} code - The HTTP status code to return if the test fails
 * @returns {ValidatorObject} - A ValidatorObject is a Promise whose error handler takes a ValidatorError object
 */
export default (test, msg, code) => o(typeof test).switch({
    boolean: () => new Promise((resolve, reject) => {
        test ? resolve() : reject(error(msg, code));
    }),
    function: () => new Promise((resolve, reject) => {
        new Promise(test).then(
            resolve,
            err => {typeof err !== 'undefined' ? reject(err) : reject(error(msg, code));}
        );
    }),
    default: () => new Promise((resolve, reject) => {
        test.then(
            resolve,
            err => {typeof err !== 'undefined' ? reject(err) : reject(error(msg, code));}
        );
    })
});
