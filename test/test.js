/**
 * Created by Andrea on 9/3/2017.
 */

import assert from 'assert';
import validator from 'atp-validator';
import {validate} from 'atp-validator';
import config from 'atp-config';

config.setDefaults({
    validators: {
        shouldNotRun: done => validate(() => {done(new Error())}, "This should never run", 500),
        customFailureMessage: () => validate((resolve, reject) => {
            reject({code: 401, msg: "This is a custom failure message"});
        }, "This message should not show", 500),

        callbackValidator: status => validate((resolve, reject) => {
            status ? resolve() : reject();
        }, "This message should show", 401),
    }
});


describe('ATP-Validator', () => {
    describe('builtin', () => {
        describe("#required", () => {
           it('should fail check missing parameters', done => {
               validator().required(undefined, "name").then(
                   () => {done(new Error());},
                   () => {done();}
               );
           });

           it('should pass check provided parameters', done => {
               validator().required("someValue", "name").then(
                   () => {done();},
                   errors => {done(new Error(errors));}
               );
           });

           it('should fail check empty strings', done => {
               validator().required("", "name").then(
                   () => {done(new Error());},
                   () => {done();}
               );
           });

           it('should fail check null values', done => {
               validator().required(null, "name").then(
                   () => {done(new Error());},
                   () => {done();}
               );
           });

           it('should pass check zero', done => {
               validator().required(0, "name").then(
                   () => {done();},
                   () => {done(new Error());}
               );
           });
        });

        describe("#minLength", () => {
            it('should fail check too short strings', done => {
                validator().minLength("a", "test", 2).then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail check empty strings', done => {
                validator().minLength("", "test", 2).then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail check null values', done => {
                validator().minLength(null, "test", 2).then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail check undefined values', done => {
                validator().minLength(undefined, "test", 2).then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail check numbers', done => {
                validator().minLength(123, "test", 2).then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail check objects', done => {
                validator().minLength({a: 1, b: 2, c: 3}, "test", 2).then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail check booleans', done => {
                validator().minLength(true, "test", 2).then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail check booleans', done => {
                validator().minLength(false, "test", 2).then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail check too short arrays', done => {
                validator().minLength(["a"], "test", 2).then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail check empty arrays', done => {
                validator().minLength([], "test", 2).then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it("should pass check longer arrays", done => {
                validator().minLength(["a", "b", "c"], "test", 2).then(
                    () => {done();},
                    () => {done(new Error());}
                );
            });

            it("should pass check exact length arrays", done => {
                validator().minLength(["a", "b"], "test", 2).then(
                    () => {done();},
                    () => {done(new Error());}
                );
            });

            it("should pass check longer strings", done => {
                validator().minLength("abc", "test", 2).then(
                    () => {done();},
                    () => {done(new Error());}
                );
            });

            it("should pass check exact length strings", done => {
                validator().minLength("ab", "test", 2).then(
                    () => {done();},
                    () => {done(new Error());}
                );
            })
       });

        describe("#isAlphaNumeric", () => {
            it('should fail check null values', done => {
                validator().isAlphaNumeric(null, "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail check undefined values', done => {
                validator().isAlphaNumeric(undefined, "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should pass check numbers', done => {
                validator().isAlphaNumeric(123, "test").then(
                    () => {done();},
                    () => {done(new Error());}
                );
            });

            it('should pass check empty strings', done => {
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

            it('should fail check objects', done => {
                validator().isAlphaNumeric({a: 1, b: 2, c: 3}, "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail check booleans', done => {
                validator().isAlphaNumeric(true, "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail check booleans', done => {
                validator().isAlphaNumeric(false, "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail check arrays', done => {
                validator().isAlphaNumeric(["a", "b", "c"], "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });
       });

        describe("#isInteger", () => {
            it('should fail check null values', done => {
                validator().isinteger(null, "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail check undefined values', done => {
                validator().isInteger(undefined, "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail check objects', done => {
                validator().isInteger({a: 1, b: 2, c: 3}, "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail check booleans', done => {
                validator().isInteger(true, "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail check booleans', done => {
                validator().isInteger(false, "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail check arrays', done => {
                validator().isInteger(["a", "b", "c"], "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail check strings', done => {
                validator().isInteger("123", "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should pass check integers', done => {
                validator().isInteger(123, "test").then(
                    () => {done();},
                    () => {done(new Error());}
                );
            });

            it('should pass check zero', done => {
                validator().isInteger(0, "test").then(
                    () => {done();},
                    () => {done(new Error());}
                );
            });

            it('should pass check negative integers', done => {
                validator().isInteger(-123, "test").then(
                    () => {done();},
                    () => {done(new Error());}
                );
            });

            it('should fail check non-integers', done => {
                validator().isInteger(123.456, "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail check negative non-integers', done => {
                validator().isInteger(-123.456, "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });
        });

        describe("#matches", () => {
            it('should pass check strings that match the pattern', done => {
                validator().matches("123", /[0-9]*/, "message").then(
                    () => {done();},
                    () => {done(new Error());}
                );
            });

            it('should fail check strings that do not match the pattern', done => {
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

            it('should fail check values that are set', done => {
                validator().missing(123, "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail check empty strings', done => {
                validator().missing("", "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail check null values', done => {
                validator().missing(null, "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail check zero', done => {
                validator().missing(0, "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail check empty arrays', done => {
                validator().missing([], "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail check empty objects', done => {
                validator().missing({}, "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });
        });

        describe("#greaterThan", () => {
            it('should pass check valid values', done => {
                validator().greaterThan(4, "test", 3).then(
                    () => {done();},
                    () => {done(new Error());}
                );
            });

            it('should fail check invalid values', done => {
                validator().greaterThan(2, "test", 3).then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail check equal values', done => {
                validator().greaterThan(4, "test", 4).then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });
        });

        describe("#lessThan", () => {
            it('should pass check valid values', done => {
                validator().lessThan(2, "test", 3).then(
                    () => {done();},
                    () => {done(new Error());}
                );
            });

            it('should fail check invalid values', done => {
                validator().lessThan(4, "test", 3).then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });

            it('should fail check equal values', done => {
                validator().lessThan(4, "test", 4).then(
                    () => {done(new Error());},
                    () => {done();}
                );
            });
        });

        describe("#isOptional", () => {
            it('should pass check missing values', done => {
                validator().isOptional(undefined, () => {}).then(
                    () => {done();},
                    () => {done(new Error());}
                );
            });

            it('should not run sub-validator check missing values', done => {
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
                            ? done() : done(new Error());
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
        it('should fail properly check missing validators', done => {
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

        it('should run chains whose dependencies pass', done => {
            validator()
                .check("first")
                    .isInteger(123, "test")
                .check("second").if(["first"])
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
});
