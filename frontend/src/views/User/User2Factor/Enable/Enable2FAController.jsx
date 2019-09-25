/**
 * User 2Factor Enable Controller
 *
 * Contains functions related to handling 2FA Enable responses and actions.
 * Enables redirecting the user depending on the response from the API
 * service. Also provides alert data for the view if needed.
 */

// Dependencies
import { get } from "lodash";

// Config & Application Links
import { links } from "../../../../config";

// Response Handler
import ResponseHandler from "../../../../util/ResponseHandler";

// Declare the User 2Factor Enable Controller.
const Enable2FactorController = {};

/**
 * Determine post User 2Factor Enable response action
 *
 * Function takes in the status of the User 2Factor Enable response in order to
 * determine the post 2FA action to be taken, whether that is to
 * display an error message, or to redirect the user. A promise is used
 * to redirect the user while reject is used to display a message.
 *
 * @param {number} response The response from the API request.
 * @param {Object} languageData Current language information for the app. Language data object.
 */
Enable2FactorController.handleResponse = async (response, languageData) => {
    // Redirect data for the redirectable statuses.
    const redirectData = {
        "200": {
            redirect: links.user.profile,
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
 * Handle User 2Factor Enable Actions
 *
 * Uses the custom Response Handler to handle User 2Factor Enable actions.
 *
 * @param {Object} responseObject Response object from the request with alert info or redirect info.
 * @param {Object} data Data object required for handling the action.
 * @param {Function} action Redux action to handle data.
 */
Enable2FactorController.handleAction = (responseObject, data, action) => {
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

// Export the Verify 2Factor Controller.
export default Enable2FactorController;