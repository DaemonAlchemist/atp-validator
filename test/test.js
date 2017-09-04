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
        describe.skip("#minLength", () => {
          it('should have tests', () => {});
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
