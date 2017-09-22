/**
 * Created by Andrea on 8/30/2017.
 */

import error from "./error";
import {o} from 'atp-sugar';

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
