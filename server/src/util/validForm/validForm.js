/**
 * Valid Form Module
 *
 * This module will validate input values for different endpoints to ensure
 * values follow the required guidelines for the input value.
 */

// Dependencies
const { get, mapKeys, isEmpty } = require("lodash");

// Declare the Valid Form module.
const validForm = {};

/**
 * Validate form data
 *
 * Validate form inputs for an API endpoint by looping through the inputs
 * and using the `validateInputs` function to determine whether to return
 * true or false.
 */
validForm.validate = (validation, inputs) => {
    // Form error boolean.
    let formErrors = false;

    // Loop through the required inputs and validate the values for the inputs.
    Object.keys(validation).some(rule => {
        // Validate the input item.
        if (validForm.validateInput(inputs[rule], validation[rule]) === true) {
            // Set the formErrors boolean to true and return from the loop.
            formErrors = true;
            return true;
        }
    });

    return formErrors;
}

/**
 * Validate form inputs
 *
 * Validate form inputs and return true or false depending on whether or not
 * the input has an error based on its validation rules.
 *
 * @param {String || Number} val Input's value.
 * @param {Object} inputValidations Object of validation rules for the input.
 * @param {String || Number} secondValue A second value to compare the validated value against.
 */
validForm.validateInput = (val, validationRules = {}, secondValue) => {
    // Input error array.
    let errors = false;
    // Return empty string for value in case none is provided (undefined).
    const value = val ? val : "";
    // Value's length.
    const length = value.length;

    // Regex for valid emails.
    const emailRegex = new RegExp(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

    // Regex for only alphabetic characters.
    const alphaOnly = new RegExp(/^[a-z]+$/i);
    // Regex for only lowercase alphabetic characters.
    const alphaLowerOnly = new RegExp(/^[a-z]+$/);
    // Regex for only uppercase alphabetic characters.
    const alphaUpperOnly = new RegExp(/^[A-Z]+$/);
    // Regex for only alphanumeric characters.
    const alphaNumericOnly = new RegExp(/^[a-z0-9]+$/i);
    // Regex for alphabetic characters being required.
    const alphaRequired = new RegExp(/[a-z]/i);
    // Regex for only numeric characters.
    const numericOnly = new RegExp(/^[0-9]+$/);
    // Regex for numeric characters being required.
    const numericRequired = new RegExp(/[0-9]/);
    // Regex for special characters being required.
    const specialCharactersRequired = new RegExp(/[!@#$%^&*()_+-={}|,.?]/);

    // Map over the validation rules.
    mapKeys(validationRules, ({ rule }, ruleKey) => {
        switch (ruleKey) {
            case "confirmValue":
                if (validationRules.hasOwnProperty("required") && !isEmpty(value) && value !== secondValue) {
                    errors = true;
                }
                break;
            case "length":
                if (validationRules.hasOwnProperty("required") && !isEmpty(value) && length !== rule) {
                    errors = true;
                }
                break;
            case "minLength":
                if (validationRules.hasOwnProperty("required") && !isEmpty(value) && length < rule) {
                    errors = true;
                }
                break;
            case "max":
                if (parseFloat(length, 10) > rule) {
                    errors = true;
                }
                break;
            case "min":
                if (parseFloat(length, 10) < rule) {
                    errors = true;
                }
                break;
            case "required":
                if (isEmpty(value)) {
                    errors = true;
                }
                break;
            case "email":
                if (!isEmpty(value)) {
                    if (!emailRegex.test(value)) {
                        errors = true;
                    }
                }
                break;
            case "phoneRequired":
                if (!isEmpty(value) && length !== 10) {
                    errors = true;
                }

                if (!Number.isInteger(Number.parseInt(value))) {
                    errors = true;
                }
                break;
            case "phoneOptional":
                if (!isEmpty(value) && length !== 10) {
                    errors = true;

                    if (!Number.isInteger(Number.parseInt(value))) {
                        errors = true;
                    }
                }
                break;
            case "alphaOnly":
                if (!isEmpty(value)) {
                    if (!alphaOnly.test(value)) {
                        errors = true;
                    }
                }
                break;
            case "alphaLowerOnly":
                if (!isEmpty(value)) {
                    if (!alphaLowerOnly.test(value)) {
                        errors = true;
                    }
                }
                break;
            case "alphaUpperOnly":
                if (!isEmpty(value)) {
                    if (!alphaUpperOnly.test(value)) {
                        errors = true;
                    }
                }
                break;
            case "alphaNumericOnly":
                if (!isEmpty(value)) {
                    if (!alphaNumericOnly.test(value)) {
                        errors = true;
                    }
                }
                break;
            case "alphaRequired":
                if (!isEmpty(value)) {
                    if (!alphaRequired.test(value)) {
                        errors = true;
                    }
                }
                break;
            case "numericOnly":
                if (!isEmpty(value)) {
                    if (!numericOnly.test(value)) {
                        errors = true;
                    }
                }
                break;
            case "numericRequired":
                if (!isEmpty(value)) {
                    if (!numericRequired.test(value)) {
                        errors = true;
                    }
                }
                break;
            case "specialCharactersRequired":
                if (!isEmpty(value)) {
                    if (!specialCharactersRequired.test(value)) {
                        errors = true;
                    }
                }
                break;
            case "regex":
                if (!new RegExp(value).test(value)) {
                    errors = true;
                }
                break;
            case "boolean":
                if ((value !== true) && (value !== false)) {
                    errors = true;
                }
                break;
            default:
                break;
        }
    });

    // Return errors.
    return errors;
};

// Export the Input Validation function.
module.exports = validForm;