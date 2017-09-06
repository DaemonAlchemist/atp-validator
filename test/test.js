/**
 * Created by Andrea on 9/3/2017.
 */

import assert from 'assert';
import validator from 'atp-validator';

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
        describe.skip("#isAlphaNumeric", () => {
           it('should have tests', () => {});
       });
        describe.skip("#isInteger", () => {
           it('should have tests', () => {});
       });
    });
    describe.skip("#chain", () => {
        it('should have tests', () => {});
    });
    describe.skip("#all", () => {
        it('should have tests', () => {});
    });
    describe.skip("#complex validations", () => {
        it('should have tests', () => {});
    });
});
