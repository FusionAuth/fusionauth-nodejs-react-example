/**
 * Response Handler
 *
 * Contains the methods for handling API responses and providing the proper
 * redirect link or error type and message for either form based alerts, or
 * for the Toasty module. Also handles actions for API responses.
 */

// Dependencies
import { get } from "lodash";

// History
import History from "../History";
import Toasty from "../Toasty";

// Declare the Response Handler
const ResponseHandler = {};

/**
 * Response Status
 *
 * Handle response statuses so that the views know how to handle them. Returns
 * a promise that resolves with a redirect link, or rejects with an error object.
 *
 * @param {Number} response The response from the API request.
 * @param {Boolean} apiMessage A boolean on whether or not to use the API response message.
 * @param {Object} languageData Current language information for the app. Current language information for the app.
 * @param {Array} langKey Key for which status code message to display
 * @param {Object} alertData Status codes and their respective alert type.
 * @param {Object} redirectData Status codes and their respective redirect link.
 */
ResponseHandler.status = ({ response, apiMessage, languageData, langKey, alertData, redirectData = {} }) => {
    // Get the status from the response.
    const status = response.status;

    // Return a promise.
    return new Promise((resolve, reject) => {
        // Check if the status is in the redirect object.
        if (redirectData.hasOwnProperty(status)) {
            // Check if the redirect requires a Toast notification.
            if (redirectData[status].hasOwnProperty("alert")) {
                // Get the proper message for the Toast notification.
                const message = apiMessage
                    ? response.data.message
                    : get(languageData, [...langKey, status])
                        ? get(languageData, [...langKey, status])
                        : get(languageData, [...langKey, 500]);

                Toasty.notify({
                    type: Toasty.info(),
                    content: message
                })
            }

            // Resolve with the link to redirect to.
            resolve({
                redirect: redirectData[status]["redirect"]
            });
        } else {
            // Get the alert type if it exists, or default to status 500 alert type.
            const alertType = alertData.hasOwnProperty(status) ? alertData[status] : alertData[500];

            // Check if we should return the response from the API or find the response in the
            // language files.
            if (apiMessage) {
                reject({
                    type: alertType,
                    content: response.data.message
                });
            } else {
                // Check if the language key exists for the status to reject an error object
                // with the message for the status or 500, and the alert type.
                if (get(languageData, [...langKey, status])) {
                    reject({
                        type: alertType,
                        content: get(languageData, [...langKey, status])
                    });
                } else {
                    reject({
                        type: alertType,
                        content: get(languageData, [...langKey, 500])
                    });
                }
            }
        }
    });
};

/**
 * Handle app actions
 *
 * A custom action handler that handles redirects and errors for the user.
 *
 * @param {Object} responseObject The object response with alert info or redirect info.
 * @param {Object} data Data object required for handling the action.
 * @param {Function} action Redux action to handle data.
*/
ResponseHandler.action = (responseObject, data, action) => {
    if (responseObject.redirect) {
        // If the redirect is to the homepage, then the user has been logged in, so
        // we must log the user in on the frontend.
        if (responseObject.setUser && data.user) {
            // Use the redux action to handle the user object.
            action(data.user);
        }

        // Redirect the user to the location in the response object.
        History.push({
            pathname: responseObject.redirect,
            state: {
                twoFactorId: get(data, "twoFactorId"),
                changePasswordId: get(data, "changePasswordId"),
                from: get(responseObject, "from"),
                displayMessage: true
            }
        });
    } else {
        // Return with the responseObject since there was an error.
        return responseObject;
    }
};

// Export the Response Handler.
export default ResponseHandler;