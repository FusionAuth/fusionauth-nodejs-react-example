/**
 * Change Password Controller
 *
 * Contains functions related to handling Change Password responses and actions.
 * Enables redirecting the user depending on the response from the API
 * service. Also provides alert data for the view if needed.
 */

// Dependencies
import { get } from "lodash";

// Config & Application Links
import { links } from "../../../config";

// Response Handler
import ResponseHandler from "../../../util/ResponseHandler";

// Declare the Change Password Controller.
const ChangePasswordController = {};

/**
 * Determine post Change Password response action
 *
 * Function takes in the status of the Change Password response in order to
 * determine the post Change Password action to be taken, whether that is to
 * display an error message, or to redirect the user. A promise is used
 * to redirect the user while reject is used to display a message.
 *
 * @param {Number} response The response from the API request.
 * @param {Object} languageData Current language information for the app. Language data object.
 */
ChangePasswordController.handleResponse = async (response, languageData) => {
    // Redirect data for the redirectable statuses.
    const redirectData = {
        "200": {
            redirect: links.home,
            alert: true
        }
    };
    // Alert data information for statuses. All statuses in this case use
    // the `danger` type, so we default all statuses to this with `500` as the key.
    const alertData = {
        "500": "danger"
    }

    // Return a promise with the results.
    return new Promise(async (resolve, reject) => {
        try {
            // Resolve with the redirect link.
            resolve(await ResponseHandler.status({ response, apiMessage: true, languageData, langKey: null, redirectData, alertData }));
        } catch (error) {
            // Reject with the error object.
            reject(error);
        }
    });
};

/**
 * Handle Change Password Actions
 *
 * Uses the custom Response Handler to handle Change Password actions.
 *
 * @param {Object} responseObject Response object from the request with alert info or redirect info.
 * @param {Object} data Data object required for handling the action.
 * @param {Function} action Redux action to handle data.
 */
ChangePasswordController.handleAction = (responseObject, data, action) => {
    // Add additional content to the response object to be handled.
    responseObject = {
        ...responseObject,
        setUser: true
    }

    // Use the custom Response Handler to determine what to do with the user.
    const response = ResponseHandler.action(responseObject, data, action);

    // Check if there are any errors to display.
    if (get(response, "type")) {
        // Return the error information.
        return response;
    } else {
        // No error, so the user was redirected.
        return false;
    }
}

// Export the Change Password Controller.
export default ChangePasswordController;