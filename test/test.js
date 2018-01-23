/**
 * Created by Andrea on 9/3/2017.
 */

import assert from 'assert';
import validator from 'atp-validator';
import {validate, addValidators} from 'atp-validator';
import config from 'atp-config';

config.setDefaults({
    validators: {
        shouldNotRun: done => validate(() => {done(new Error())}, "This should never run", 500),
        customFailureMessage: () => validate((resolve, reject) => {
            reject({code: 401, msg: "This is a custom failure message"});
        }, "This message should not show", 500),

        callbackValidator: status => validate(
            (resolve, reject) => {status ? resolve() : reject();},
            "This message should show",
            401
        ),

        promiseValidator: status => validate(
            new Promise((resolve, reject) => {status ? resolve() : reject();}),
            "This message should show",
            401
        ),
        brokenValidator: () => validate(
            (resolve, reject) => {throw new Error("This validator is broken")},
            "This is the message for the broken validator",
            400
        ),
        invalidValidator: validate(  //Note missing function call:  () => ...
            true,
            "This is the message for te invalid validator",
            400
        )
    }
});


describe('ATP-Validator', () => {
    describe('builtin', () => {
        describe("#required", () => {
           it('should fail for missing parameters', done => {
               validator().required(undefined, "name").then(
                   () => {done(new Error());},
                   () => {done();}
               );
           });

           it('should pass for provided parameters', done => {
               validator().required("someValue", "name").then(
                   () => {done();},
                   errors => {done(new Error(errors));}
               );
           });

           it('should fail for empty strings', done => {
               validator().required("", "name").then(
                   () => {done(new Error());},
                   () => {done();}
               );
           });

           it('should fail for null values', done => {
               validator().required(null, "name").then(
                   () => {done(new Error());},
                   () => {done();}
               );
           });

           it('should pass for zero', done => {
               validator().required(0, "name").then(
                   () => {done();},
                   () => {done(new Error());}
               );
           });
        });

        describe("#minLength", () => {
            it('should fail for too short strings', done => {
                validator().minLength("a", "test", 2).then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail for empty strings', done => {
                validator().minLength("", "test", 2).then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail for null values', done => {
                validator().minLength(null, "test", 2).then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail for undefined values', done => {
                validator().minLength(undefined, "test", 2).then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail for numbers', done => {
                validator().minLength(123, "test", 2).then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail for objects', done => {
                validator().minLength({a: 1, b: 2, c: 3}, "test", 2).then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail for booleans', done => {
                validator().minLength(true, "test", 2).then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail for booleans', done => {
                validator().minLength(false, "test", 2).then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail fpr too short arrays', done => {
                validator().minLength(["a"], "test", 2).then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail for empty arrays', done => {
                validator().minLength([], "test", 2).then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it("should pass for longer arrays", done => {
                validator().minLength(["a", "b", "c"], "test", 2).then(
                    () => {done();},
                    () => {done(new Error());}
                );
            });

            it("should pass for exact length arrays", done => {
                validator().minLength(["a", "b"], "test", 2).then(
                    () => {done();},
                    () => {done(new Error());}
                );
            });

            it("should pass for longer strings", done => {
                validator().minLength("abc", "test", 2).then(
                    () => {done();},
                    () => {done(new Error());}
                );
            });

            it("should pass for exact length strings", done => {
                validator().minLength("ab", "test", 2).then(
                    () => {done();},
                    () => {done(new Error());}
                );
            })
       });

        describe("#isAlphaNumeric", () => {
            it('should fail for null values', done => {
                validator().isAlphaNumeric(null, "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail for undefined values', done => {
                validator().isAlphaNumeric(undefined, "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should pass for numbers', done => {
                validator().isAlphaNumeric(123, "test").then(
                    () => {done();},
                    () => {done(new Error());}
                );
            });

            it('should pass for empty strings', done => {
                validator().isAlphaNumeric("", "test").then(
                    () => {done();},
                    () => {done(new Error());}
                );
            });

            it('should allow letters and numbers', done => {
                const str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                validator().isAlphaNumeric(str, "test").then(
                    () => {done();},
                    () => {done(new Error());}
                );
            });

            "`~!@#$%^&*()_-+={[}]|\\:;\"'?/>.<,".split("").forEach(char => {
                it('should not allow the character ' + char, done => {
                    validator().isAlphaNumeric(char, "test").then(
                        () => {done(new Error());},
                        () => {done();}
                    );
                });
            });

            it('should fail for objects', done => {
                validator().isAlphaNumeric({a: 1, b: 2, c: 3}, "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail for booleans', done => {
                validator().isAlphaNumeric(true, "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail for booleans', done => {
                validator().isAlphaNumeric(false, "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail for arrays', done => {
                validator().isAlphaNumeric(["a", "b", "c"], "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });
       });

        describe("#isInteger", () => {
            it('should fail for null values', done => {
                validator().isinteger(null, "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail for undefined values', done => {
                validator().isInteger(undefined, "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail for objects', done => {
                validator().isInteger({a: 1, b: 2, c: 3}, "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail for booleans', done => {
                validator().isInteger(true, "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail for booleans', done => {
                validator().isInteger(false, "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail for arrays', done => {
                validator().isInteger(["a", "b", "c"], "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail for strings', done => {
                validator().isInteger("abc", "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail for empty strings', done => {
                validator().isInteger("", "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should pass for integer strings', done => {
                validator().isInteger("123", "test").then(
                    () => {done();},
                    () => {done(new Error());}
                )
            });

            it('should pass for integers', done => {
                validator().isInteger(123, "test").then(
                    () => {done();},
                    () => {done(new Error());}
                );
            });

            it('should pass for zero', done => {
                validator().isInteger(0, "test").then(
                    () => {done();},
                    () => {done(new Error());}
                );
            });

            it('should pass for negative integers', done => {
                validator().isInteger(-123, "test").then(
                    () => {done();},
                    () => {done(new Error());}
                );
            });

            it('should fail for non-integers', done => {
                validator().isInteger(123.456, "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail for negative non-integers', done => {
                validator().isInteger(-123.456, "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });
        });

        describe.skip("#isOneOf", () => {
            it('should have tests', () => {});
        });

        describe("#matches", () => {
            it('should pass for strings that match the pattern', done => {
                validator().matches("123", /[0-9]*/, "message").then(
                    () => {done();},
                    () => {done(new Error());}
                );
            });

            it('should fail for strings that do not match the pattern', done => {
                validator().matches("123", /[a-z]+/, "message").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            })
        });

        describe("#missing", () => {
            it('should pass if a value is missing', done => {
                validator().missing(undefined, "test").then(
                    () => {done();},
                    () => {done(new Error());}
                );
            });

            it('should fail for values that are set', done => {
                validator().missing(123, "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail for empty strings', done => {
                validator().missing("", "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail for null values', done => {
                validator().missing(null, "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail for zero', done => {
                validator().missing(0, "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail for empty arrays', done => {
                validator().missing([], "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail for empty objects', done => {
                validator().missing({}, "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });
        });

        describe("#greaterThan", () => {
            it('should pass for valid values', done => {
                validator().greaterThan(4, "test", 3).then(
                    () => {done();},
                    () => {done(new Error());}
                );
            });

            it('should fail for invalid values', done => {
                validator().greaterThan(2, "test", 3).then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail for equal values', done => {
                validator().greaterThan(4, "test", 4).then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });
        });

        describe("#lessThan", () => {
            it('should pass for valid values', done => {
                validator().lessThan(2, "test", 3).then(
                    () => {done();},
                    () => {done(new Error());}
                );
            });

            it('should fail for invalid values', done => {
                validator().lessThan(4, "test", 3).then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail for equal values', done => {
                validator().lessThan(4, "test", 4).then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });
        });

        describe("#isOptional", () => {
            it('should pass for missing values', done => {
                validator().isOptional(undefined, () => {}).then(
                    () => {done();},
                    () => {done(new Error());}
                );
            });

            it('should not run sub-validator for missing values', done => {
                validator().isOptional(undefined, (v, value) =>
                    v.shouldNotRun(done)
                ).then(
                    () => {done();},
                    () => {done(new Error());}
                );
            });

            it('should pass if set and sub-validator passes', done => {
                validator().isOptional(123, (v, value) =>
                    v.isInteger(value, "test")
                ).then(
                    () => {done();},
                    () => {done(new Error());}
                );
            });

            it('should fail if set and sub-validator fails', done => {
                validator().isOptional(123.456, (v, value) =>
                    v.isInteger(value, "test")
                ).then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should pass through sub-validator failure messages', done => {
                validator().isOptional(123.456, (v, value) =>
                    v.isInteger(value, "test")
                ).then(
                    () => {done(new Error());},
                    errors => {
                        errors.length === 1 &&
                        errors[0].code === 400 &&
                        errors[0].msg === "test must be an integer"
                            ? done() : done(new Error(JSON.stringify(errors)));
                    }
                );
            });
        });

        describe("#pass", () => {
            it('should pass', done => {
                validator().pass().then(
                    () => {done();},
                    () => {done(new Error());}
                );
            });
        });
    });

    describe("#check(inSeries)", () => {
        it('should pass if all tests pass', done => {
            validator().check("test")
                .isInteger(123, "test")
                .isAlphaNumeric("abc123", "test")
                .then(
                    () => {done();},
                    errors => {done(new Error(JSON.stringify(errors)));}
                );
        });

        it('should fail if ANY test fails', done => {
            validator().check("test")
                .isInteger(123.456, "test")
                .isAlphaNumeric("abc123", "test")
                .then(
                    () => {done(new Error());},
                    () => {done();}
                );
        });

        it('should fail if ANY test fails', done => {
            validator().check("test")
                .isInteger(123, "test")
                .isAlphaNumeric("abc#123", "test")
                .then(
                    () => {done(new Error());},
                    () => {done();}
                );
        });

        it('should fail if ALL tests fail', done => {
            validator().check("test")
                .isInteger(123.456, "test")
                .isAlphaNumeric("abc#123", "test")
                .then(
                    () => {done(new Error());},
                    () => {done();}
                );
        });

        it('should only return the first error if multiple tests fail', done => {
            validator().check("test")
                .isInteger(123.456, "test")
                .isAlphaNumeric("abc#123", "test")
                .then(
                    () => {done(new Error());},
                    errors => {
                        errors.length === 1 && errors[0].msg === 'test must be an integer'
                            ? done()
                            : done(new Error());
                    }
                );
        });

        it('should not run subsequent tests if one fails', done => {
            validator().check("test")
                .isInteger(123.456, "test")
                .shouldNotRun(done)
                .then(
                    () => {done();},
                    () => {done();},
                );
        });

        it('should pass if set contains no validators', done => {
            validator().check("something").then(
                () => {done();},
                errors => {done(new Error(JSON.stringify(errors)));}
            );
        })
    });

    describe("#check(inParallel)", () => {
        it('should pass if all tests pass', done => {
            validator().check("test").inParallel()
                .isInteger(123, "test")
                .isAlphaNumeric("abc123", "test")
                .then(
                    () => {done();},
                    () => {done(new Error());}
                );
        });

        it('should fail if ANY test fails', done => {
            validator().check("test").inParallel()
                .isInteger(123.456, "test")
                .isAlphaNumeric("abc123", "test")
                .then(
                    () => {done(new Error());},
                    () => {done();}
                );
        });

        it('should fail if ANY test fails', done => {
            validator().check("test").inParallel()
                .isInteger(123, "test")
                .isAlphaNumeric("abc#123", "test")
                .then(
                    () => {done(new Error());},
                    () => {done();}
                );
        });

        it('should fail if ALL tests fail', done => {
            validator().check("test").inParallel()
                .isInteger(123.456, "test")
                .isAlphaNumeric("abc#123", "test")
                .then(
                    () => {done(new Error());},
                    () => {done();}
                );
        });

        it('should return all errors if multiple tests fail', done => {
            validator().check("test").inParallel()
                .isInteger(123.456, "test")
                .isAlphaNumeric("abc#123", "test")
                .then(
                    () => {done(new Error());},
                    errors => {
                        errors.length === 2
                        && errors[0].msg === 'test must be an integer'
                        && errors[1].msg === 'test must contain only letters and numbers'
                            ? done()
                            : done(new Error());
                    }
                );
        });
    });

    describe("#custom validators", () => {
        it('should fail properly for missing validators', done => {
            validator().check("test").thisValidatorDoesntExist().then(
                () => {done(new Error());},
                errors => {
                    errors.length === 1
                    && errors[0].code === 500
                    && errors[0].msg === "Missing validator thisValidatorDoesntExist"
                        ? done()
                        : done(new Error(JSON.stringify(errors)));
                }
            );
        });

        it('should fail properly for invalid validators', done => {
            validator().invalidValidator().then(
                () => {done(new Error())},
                errors => {
                    errors.length === 1
                    && errors[0].code === 500
                    && errors[0].msg === "Invalid validator invalidValidator"
                        ? done()
                        : done(new Error(JSON.stringify(errors)));
                }
            )
        });

        it('should be able to use newly added validators', done => {
            addValidators({
                newValidator: () => validate(
                    (resolve, reject) => {resolve()},
                    "New Validator message",
                    400
                )
            });

            validator().newValidator().then(
                () => {done();},
                () => {done(new Error());}
            );
        });
    });

    describe("#callback validators", () => {
        it('should properly handle callback validators', done => {
            validator().check("test").callbackValidator(false).then(
                () => {done(new Error());},
                errors => {
                    errors.length === 1
                    && errors[0].code === 401
                    && errors[0].msg === "This message should show"
                        ? done()
                        : done(new Error(JSON.stringify(errors)));
                }
            );
        });

        it('should properly handle callback validators', done => {
            validator().check("test").callbackValidator(true).then(
                () => {done();},
                () => {done(new Error());}
            )
        });

        it('should properly handle promise validators', done => {
            validator().check("test").promiseValidator(false).then(
                () => {done(new Error());},
                errors => {
                    errors.length === 1
                    && errors[0].code === 401
                    && errors[0].msg === "This message should show"
                        ? done()
                        : done(new Error(JSON.stringify(errors)));
                }
            );
        });

        it('should properly handle promise validators', done => {
            validator().check("test").promiseValidator(true).then(
                () => {done();},
                () => {done(new Error());}
            )
        });

        it('should pass through custom failure messages', done => {
            validator().check("test").customFailureMessage().then(
                () => {done(new Error());},
                errors => {
                    errors.length === 1
                    && errors[0].code === 401
                    && errors[0].msg === "This is a custom failure message"
                        ? done()
                        : done(new Error(JSON.stringify(errors)));
                }
            )
        });
    });

    describe("#if dependencies", () => {
        it('should skip chains whose dependencies fail', done => {
            validator()
                .check("first")
                    .isInteger(123.456, "test")
                .check("second").if(["first"])
                    .shouldNotRun(done)
                .then(
                    () => {done(new Error());},
                    errors => {
                        errors.length === 1
                        && errors[0].code === 400
                        && errors[0].msg === "test must be an integer"
                            ? done()
                            : done(new Error(JSON.stringify(errors)));
                    }
                );
        });

        it('should fail if ANY dependencies fail', done => {
            validator()
                .check("first")
                    .isInteger(123, "test")
                .check("second")
                    .isInteger("notANumber", "test2")
                .check("third").if(["first", "second"])
                    .shouldNotRun(done)
                .then(
                    () => {done(new Error());},
                    errors => {
                        errors.length === 1
                        && errors[0].code === 400
                        && errors[0].msg === "test2 must be an integer"
                            ? done()
                            : done(new Error(JSON.stringify(errors)));
                    }
                );
        });

        it('should fail if ALL dependencies fail', done => {
            validator()
                .check("first")
                    .isInteger(123.456, "test")
                .check("second")
                    .isInteger("notANumber", "test2")
                .check("third").if(["first", "second"])
                    .shouldNotRun(done)
                .then(
                    () => {done(new Error());},
                    errors => {
                        errors.length === 2
                        && errors[0].code === 400
                        && errors[0].msg === "test must be an integer"
                        && errors[1].code === 400
                        && errors[1].msg === "test2 must be an integer"
                            ? done()
                            : done(new Error(JSON.stringify(errors)));
                    }
                );
        });

        it('should run chains whose dependencies pass', done => {
            validator()
                .check("first")
                    .isInteger(123, "test")
                .check("second")
                    .isInteger(456, "test2")
                .check("third").if(["first", "second"])
                    .customFailureMessage()
                .then(
                    () => {done(new Error());},
                    errors => {
                        errors.length === 1
                        && errors[0].code === 401
                        && errors[0].msg === "This is a custom failure message"
                            ? done()
                            : done(new Error(JSON.stringify(errors)));
                    }
                );
        });

        it('should accept a string if a chain only has one dependency', done => {
            validator()
                .check("first")
                    .isInteger(123, "test")
                .check("second").if("first")
                    .customFailureMessage()
                .then(
                    () => {done(new Error());},
                    errors => {
                        errors.length === 1
                        && errors[0].code === 401
                        && errors[0].msg === "This is a custom failure message"
                            ? done()
                            : done(new Error(JSON.stringify(errors)));
                    }
                );
        });
    });

    describe("#ifAny dependencies", () => {
        it('should fail if ALL dependencies fail', done => {
            validator()
                .check("first")
                    .isInteger(123.456, "test")
                .check("second")
                    .isInteger(456.789, "test2")
                .check("third").ifAny(["first", "second"])
                    .shouldNotRun(done)
                .then(
                    () => {done(new Error());},
                    errors => {
                        errors.length === 2
                        && errors[0].code === 400
                        && errors[0].msg === "test must be an integer"
                        && errors[1].code === 400
                        && errors[1].msg === "test2 must be an integer"
                            ? done()
                            : done(new Error(JSON.stringify(errors)));
                    }
                );
        });

        it('should pass if ANY dependencies pass', done => {
            validator()
                .check("first")
                    .isInteger(123, "test")
                .check("second")
                    .isInteger("notANumber", "test2")
                .check("third").ifAny(["first", "second"])
                    .customFailureMessage()
                .then(
                    () => {done(new Error());},
                    errors => {
                        errors.length === 1
                        && errors[0].code === 401
                        && errors[0].msg === "This is a custom failure message"
                            ? done()
                            : done(new Error(JSON.stringify(errors)));
                    }
                );
        });

        it('should pass if ALL dependencies pass', done => {
            validator()
                .check("first")
                    .isInteger(123, "test")
                .check("second")
                    .isInteger(456, "test2")
                .check("third").ifAny(["first", "second"])
                    .customFailureMessage()
                .then(
                    () => {done(new Error());},
                    errors => {
                        errors.length === 1
                        && errors[0].code === 401
                        && errors[0].msg === "This is a custom failure message"
                            ? done()
                            : done(new Error(JSON.stringify(errors)));
                    }
                );
        });

        it('should accept a string if a chain only has one dependency', done => {
            validator()
                .check("first")
                    .isInteger(123, "test")
                .check("second").ifAny("first")
                    .customFailureMessage()
                .then(
                    () => {done(new Error());},
                    errors => {
                        errors.length === 1
                        && errors[0].code === 401
                        && errors[0].msg === "This is a custom failure message"
                            ? done()
                            : done(new Error(JSON.stringify(errors)));
                    }
                );
        });
    });

    describe("#error handling", () => {
        it('should properly intercept exceptions from validators', done => {
            validator().brokenValidator().then(
                () => {done(new Error());},
                errors => {
                    errors.length === 1
                    && errors[0].code === 500
                    && errors[0].msg.indexOf("There was a problem with the brokenValidator validator: Error: This validator is broken") === 0
                        ? done()
                        : done(new Error(JSON.stringify(errors)));
                }
            )
        });
    });
});
