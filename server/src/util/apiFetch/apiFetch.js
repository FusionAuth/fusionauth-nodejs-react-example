/**
 * API Fetch Module
 *
 * This module handles API requests to the FusionAuth server.
 */

// Dependencies
const axios = require("axios");
const { get, map } = require("lodash");

// Config
const config = require("../../config");

// Data
const fusionAuthData = require("../../data/fusionAuth");

// Declare the API Fetch module
const apiFetch = {};

/**
 * Send Request
 *
 * Send a request to the FusionAuth server.
 *
 * @param {Object} endpoint An object with the URL and Method for the API request.
 * @param {Object} data A JSON stringified object with data for the API request.
 * @param {String} accessToken The current user's access token
 * @param {Boolean} contentTypeJSON Determines the content type to send for the request.
 */
apiFetch.go = (endpoint, data, accessToken, contentTypeJSON = true) => {
    // Determine the authorization method.
    const Authorization = accessToken ? `JWT ${ accessToken }` : config.fusionAuth.apiKey;
    // Determine the content type.
    const contentType = contentTypeJSON ? "application/json": "application/x-www-form-urlencoded";

    // Setup the data object for the request.
    data = data !== null ? JSON.stringify(data) : null;

    // Axios request to the FusionAuth server.
    return new Promise((resolve, reject) => {
        axios({
            baseURL: config.fusionAuth.baseURL,
            url: endpoint.PATH_SEARCH,
            method: endpoint.PATH_METHOD,
            data,
            headers: {
                "Content-Type": contentType,
                Authorization
            }
        }).then(response => {
            // Return the success response.
            resolve(response);
        }).catch(error => {
            // Return the error response.
            reject(error);
        });
    });
}

/**
 * Handle API Response
 *
 * Return the proper error message for a given API response status code.
 *
 * @param {Number} status The API response status.
 * @param {Object} languageData Current language information for the app. Current language information for the app.
 * @param {Array} langKey Key for which status code message to display
 */
apiFetch.handleResponse = (status, languageData, langKey) => {
    // Check if the status code exists for the given language key.
    if (get(languageData, [...langKey, status])) {
        return get(languageData, [...langKey, status]);
    } else {
        // Default to a server error message.
        return get(languageData, [...langKey, 500]);
    }
}

/**
 * Handle API Errors
 *
 * Handle API response errors by determining what the error is and replacing any necessary information
 * in the error message with an appropriate value, if needed.
 *
 * @param {Object} errors The errors that were returned with the response.
 * @param {Object} reqObj The request object sent with the API request.
 * @param {Object} languageData Current language information for the app. Current language information for the app.
 * @param {Array} langKey Key for which status code message to display
 */
apiFetch.handleError = (errors, reqObj, languageData, langKey) => {
    // Setup a message variable to return.
    let message = [];

    // Loop through the items in the error object.
    map(errors, errorObject => {
        // Setup a variable with the error code.
        const errorCode = errorObject[0].code;
        // Setup a temporary variable for the error message.
        let tempMessage = get(languageData, [...langKey, errorCode]);

        if (tempMessage) {
            // Check if the message includes a placeholder.
            if (tempMessage.includes("%s")) {
                // Setup a temporary value to replace with in the string.
                let replacedWith = "undefined";

                // Check what the error code is about to replace it with the proper value.
                if (errorCode.includes("username")) {
                    replacedWith = reqObj.username;
                } else if (errorCode.includes("email")) {
                    replacedWith = reqObj.email;
                }

                // Replace the placeholder.
                tempMessage = tempMessage.replace("%s", replacedWith);
            } else if (tempMessage.includes("%d")) {
                // Replace the placeholder.
                tempMessage = tempMessage.replace("%d", get(fusionAuthData, errorCode));
            }
        } else {
            // Unknown / non-setup message, return a default message.
            tempMessage = get(languageData, ["common", "fusionAuth", "invalidRequest"]);
        }

        // Push the error message to the error response array.
        message.push(tempMessage);
    });

    // Return the language specific error array.
    return message;
}

// Export the API Fetch module.
module.exports = apiFetch;