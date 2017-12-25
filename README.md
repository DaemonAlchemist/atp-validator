# Inline Validator

This package provides a validator with a fluent interface, that is designed to be used with an ExpressJS backend for validating payloads and query parameters before fetching information and/or performing actions.

Validators will run in the defined order and will stop execution after the first failure.  If you need multiple error messages to be returned to the user (in the case of form validation errors, for example), separate independent chains by using the validator's check() function.  

## Basic Usage

The basic way to use the validator is to get a validator instance, then call validator methods on the request parameters, and finally delegate to a success or error handler.

```
import validator from 'atp-validator';
...
const controller = (req, res) => {
    validator()
        .check("userName")
            .isRequired(req.body.userName, "Username")
            .isAlphaNumeric(req.body.userName, "Username")
            .minLength(req.body.userName, "Username", 5)
        .check("password")
            .isRequired(req.body.password, "UserName")
            .minLength(req.body.password, "Password", 3)
        .if(["userName", "password"])
        .then(
            () => {/* Success handler */},
            err => {/* Error handler */}
        );
}
```

## Defining Custom Validators

You can also register custom validators for your modules that can then be called just like the built-in validators

```
import validator, {addValidators, validate} form 'atp-validator';

//Define a custom validator
const isInRange = (value, min, max, name) => validate(
    value >= min && value <= max,
    name + " must be between " + min + " " + max,
    400
);

//Register your custom validator
addValidators({isInRange});
...
const controller = (req, res) => {
    validator()
        .isInRange(req.body.something, 5, 10, "Test")
        ...
}
```

