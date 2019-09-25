// Dependencies
import { get, mapKeys, isEmpty } from "lodash";

/**
 * Validate form inputs
 *
 * Validate form inputs and return an error array with all of the items
 * wrong about the input.
 *
 * @param  {String || Number} value  Input's value
 * @param  {String} type  Input's type
 * @param  {Object} inputValidations Object of validation rules for the input.
 * @param {Object} languageData Current language information for the app. Language data object.
 * @param {String || Number} secondValue A second value to compare the validated value against.
 */
const ValidateInput = (value, type, validationRules = {}, languageData, secondValue) => {
    // Input error array.
    let errors = [];
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
    mapKeys(validationRules, ({ rule, langKey }, ruleKey) => {
        switch (ruleKey) {
            case "confirmValue":
                if (validationRules.hasOwnProperty("required") && !isEmpty(value) && value !== secondValue) {
                    errors.push(get(languageData, langKey));
                }
                break;
            case "length":
                if (validationRules.hasOwnProperty("required") && !isEmpty(value) && length !== rule) {
                    errors.push(get(languageData, langKey));
                }
                break;
            case "minLength":
                if (validationRules.hasOwnProperty("required") && !isEmpty(value) && length < rule) {
                    errors.push(get(languageData, langKey));
                }
                break;
            case "max":
                if (parseFloat(length, 10) > rule) {
                    errors.push(get(languageData, langKey));
                }
                break;
            case "min":
                if (parseFloat(length, 10) < rule) {
                    errors.push(get(languageData, langKey));
                }
                break;
            case "required":
                if (type === "checkbox") {
                    if (value !== true) {
                        errors.push(get(languageData, langKey));
                    }
                } else {
                    if (isEmpty(value)) {
                        errors.push(get(languageData, langKey));
                    }
                }
                break;
            case "email":
                if (!isEmpty(value)) {
                    if (!emailRegex.test(value)) {
                        errors.push(get(languageData, langKey));
                    }
                }
                break;
            case "phoneRequired":
                if (!isEmpty(value) && length !== 10) {
                    errors.push(get(languageData, langKey));
                }

                if (!Number.isInteger(Number.parseInt(value))) {
                    errors.push(get(languageData, langKey));
                }
                break;
            case "phoneOptional":
                if (!isEmpty(value) && length !== 10) {
                    errors.push(get(languageData, langKey));

                    if (!Number.isInteger(Number.parseInt(value))) {
                        errors.push(get(languageData, langKey));
                    }
                }
                break;
            case "alphaOnly":
                if (!isEmpty(value)) {
                    if (!alphaOnly.test(value)) {
                        errors.push(get(languageData, langKey));
                    }
                }
                break;
            case "alphaLowerOnly":
                if (!isEmpty(value)) {
                    if (!alphaLowerOnly.test(value)) {
                        errors.push(get(languageData, langKey));
                    }
                }
                break;
            case "alphaUpperOnly":
                if (!isEmpty(value)) {
                    if (!alphaUpperOnly.test(value)) {
                        errors.push(get(languageData, langKey));
                    }
                }
                break;
            case "alphaNumericOnly":
                if (!isEmpty(value)) {
                    if (!alphaNumericOnly.test(value)) {
                        errors.push(get(languageData, langKey));
                    }
                }
                break;
            case "alphaRequired":
                if (!isEmpty(value)) {
                    if (!alphaRequired.test(value)) {
                        errors.push(get(languageData, langKey));
                    }
                }
                break;
            case "numericOnly":
                if (!isEmpty(value)) {
                    if (!numericOnly.test(value)) {
                        errors.push(get(languageData, langKey));
                    }
                }
                break;
            case "numericRequired":
                if (!isEmpty(value)) {
                    if (!numericRequired.test(value)) {
                        errors.push(get(languageData, langKey));
                    }
                }
                break;
            case "specialCharactersRequired":
                if (!isEmpty(value)) {
                    if (!specialCharactersRequired.test(value)) {
                        errors.push(get(languageData, langKey));
                    }
                }
                break;
            case "regex":
                if (!new RegExp(value).test(rule)) {
                    errors.push(get(languageData, langKey));
                }
                break;
            default:
                break;
        }
    });

    // Return null if the errors array is empty.
    if (isEmpty(errors)) {
        return null;
    }

    // Return the errors.
    return errors;
};

// Export the Input Validation function.
export default ValidateInput;