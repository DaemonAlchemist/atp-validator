/**
 * Created by Andrea on 9/3/2017.
 */

import assert from 'assert';
import validator from 'atp-validator';
import {validate} from 'atp-validator';
import config from 'atp-config';

config.setDefaults({
    validators: {
        fail: validate(false, "This should always fail", 500),
        pass: validate(true, "This should always pass", 500)
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
                   () => {done(new Error());}
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

            it('should fail for too short arrays', done => {
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

            it('should allow letters, number, and spaces', done => {
                const str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789";
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
                validator().isInteger("123", "test").then(
                    () => {done(new Error());},
                    () => {done();}
                );
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
    });
    describe("#chain", () => {
        it('should pass if all tests pass', done => {
            validator().chain("test")
                .isInteger(123, "test")
                .isAlphaNumeric("abc 123", "test")
                .then(
                    () => {done();},
                    () => {done(new Error());}
                );
        });

        it('should fail if ANY test fails', done => {
            validator().chain("test")
                .isInteger(123.456, "test")
                .isAlphaNumeric("abc 123", "test")
                .then(
                    () => {done(new Error());},
                    () => {done();}
                );
        });

        it('should fail if ANY test fails', done => {
            validator().chain("test")
                .isInteger(123, "test")
                .isAlphaNumeric("abc#123", "test")
                .then(
                    () => {done(new Error());},
                    () => {done();}
                );
        });

        it('should fail if ALL tests fail', done => {
            validator().chain("test")
                .isInteger(123.456, "test")
                .isAlphaNumeric("abc#123", "test")
                .then(
                    () => {done(new Error());},
                    () => {done();}
                );
        });

        it('should only return the first error if multiple tests fail', done => {
            validator().chain("test")
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
    });
    describe("#all", () => {
        it('should pass if all tests pass', done => {
            validator().all("test")
                .isInteger(123, "test")
                .isAlphaNumeric("abc 123", "test")
                .then(
                    () => {done();},
                    () => {done(new Error());}
                );
        });

        it('should fail if ANY test fails', done => {
            validator().all("test")
                .isInteger(123.456, "test")
                .isAlphaNumeric("abc 123", "test")
                .then(
                    () => {done(new Error());},
                    () => {done();}
                );
        });

        it('should fail if ANY test fails', done => {
            validator().all("test")
                .isInteger(123, "test")
                .isAlphaNumeric("abc#123", "test")
                .then(
                    () => {done(new Error());},
                    () => {done();}
                );
        });

        it('should fail if ALL tests fail', done => {
            validator().all("test")
                .isInteger(123.456, "test")
                .isAlphaNumeric("abc#123", "test")
                .then(
                    () => {done(new Error());},
                    () => {done();}
                );
        });

        it('should return all errors if multiple tests fail', done => {
            validator().all("test")
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
    describe.skip("#complex validations", () => {
        it('should have tests', () => {});
    });
});
