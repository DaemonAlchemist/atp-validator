/**
 * Created by Andrea on 8/30/2017.
 */

import error from "./error";

export default (test, msg, code) => (typeof test === 'boolean' ? test : test()) || error(msg, code);
