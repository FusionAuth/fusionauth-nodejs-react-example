/**
 * Form Handler
 *
 * Contains the methods for handling API responses and providing the proper
 * redirect link or error type and message for either form based alerts, or
 * for the Toasty module.
 */

// Dependencies
import { get, isEmpty } from "lodash";
import classNames from "classnames";

// Declare the Response Handler
const FormHandler = {};

/**
 * Get the class names for an input
 *
 * Determines the proper class names for an input based on whether it is
 * in a success or error state.
 *
 * @param {Object} formData Collection of input data from the form being checked.
 * @param {String} input Name of the input
 */
FormHandler.inputStatus = (formData, input) => {
    // Get the error state of the input.
    const error = get(formData, [input, "error"]);

    // Return the class name for the given state.
    if (error === true) {
        return classNames("is-invalid");
    } else if (error === false) {
        return classNames("is-valid");
    } else {
        // Defaults to neither success nor error state.
        return classNames();
    }
};

/**
 * Validate form inputs
 *
 * Perform input validation on form blur and update the `formData` as necessary.
 *
 * @param {String || Array} form String or array for path to the language data for the input.
 * @param {String} target Name of the input to set validation info for.
 * @param {Array} error Error list for the input.
 * @param {Object} languageData Current language information for the app. Language data object.
 */
FormHandler.validate = (form, target, error, languageData) => {
    // Setup variables for setting state.
    let isError, errorText, validText;

    // Check if there is an error with the input. Set the state variables appropriately.
    if (!isEmpty(error)) {
        isError = true;
        errorText = error;
        validText = "";
    } else {
        isError = false;
        errorText = "";
        validText = get(languageData, ["common", ...form, target, "validText"]);
    }

    // Return the information.
    return { isError, errorText, validText };
};

// Export the Form Handler.
export default FormHandler;