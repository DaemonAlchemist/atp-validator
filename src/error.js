/**
 * Create a validator error object
 *
 * @param {String} msg - The message to display when this error is triggered
 * @param {Integer} code - The HTTP status code to return when this error is triggered
 * @returns {ValidatorObject} - A standard validator error object
 */
export default (msg, code = 400) => ({code, msg});
