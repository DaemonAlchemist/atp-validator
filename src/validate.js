/**
 * Created by Andrea on 8/30/2017.
 */

import error from "./error";

export default (test, msg, code) => (typeof test === 'boolean')
    ? new Promise((resolve, reject) => {
        test ? resolve() : reject(error(msg, code));
    })
    : new Promise((resolve, reject) => {
        new Promise(test).then(
            resolve,
            err => {typeof err !== 'undefined' ? reject(err) : reject(error(msg, code));}
        );
    });
