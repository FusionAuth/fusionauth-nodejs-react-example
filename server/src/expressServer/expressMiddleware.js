/**
 * Express Middleware Module
 *
 * This module contains middleware functions for express. The functionality within the file
 * allows the server to validate JWTs passed to the user to ensure users are logged in, and
 * thus can access the API. It also has the ability to automatically refresh expired tokens
 * with a given refresh token, so long as the refresh token is not expired. You can opt out
 * of automatically renewing JWTs from refresh tokens if you wish, and can play around with
 * the lifetime of both tokens.
 */

// Dependencies
const { get } = require("lodash");

// APIFetch
const APIFetch = require("../util/apiFetch");

// Language
const language = require("../util/language");

// API Data
const expressAPI = require("./expressAPI");

// Create the express middleware module.
const expressMiddleware = {};

/**
 * Validate a JWT
 *
 * This function will validate a user's JWT before allowing them access to any API endpoint, with
 * the exception of the FusionAuth endpoints which allow the user to log into and out of the application.
 */
expressMiddleware.jwtValidate = async (req, res, next) => {
    // Language data.
    const languageData = language.getText(req.headers.locale);
    // Access tokens.
    const accessToken = get(req, ["signedCookies", "access_token"]);
    const refreshToken = get(req, ["signedCookies", "refresh_token"]);

    try {
        // Send the API request.
        await APIFetch.go(expressAPI.fusionAuth.validateToken, null, accessToken, false);
        // The user has a valid refresh token, so return the response to be processed.
        next();
    } catch (error) {
        // Determine the status of the JWT validate endpoint to determine what to do.
        if (error.response.status !== 401) {
            // Server error when trying to validate access token, let them know.
            return res.status(500).send({ message: get(languageData, ["common", "express", "validateToken", "error"]) });
        }

        // There is no refresh token, so the user must login again.
        if (!refreshToken) {
            // No refresh token is available. Make the user log in again.
            return res.status(401).send({ loginAgain: true, message: get(languageData, ["common", "express", "refreshToke", "status", "401"]) });
        }

        // Attempt to refresh the user's session.
        expressMiddleware.attemptRefresh(refreshToken, languageData)
            .then(async response => {
                // User has a valid refresh token, so update their access token and allow access to the API.
                const cookieSettings = { httpOnly: true, signed: true };

                // Set the access token cookie.
                res.cookie("access_token", response.data.token, cookieSettings);

                // Since the above line will only work for subsequent requests, update
                // the cookie for the current request with the line below.
                req.signedCookies.access_token = response.data.token;

                // Continue to the application.
                next();
            })
            .catch(error => {
                // There was an error in the attempRefresh function, so send the result.
                res.status(error.status).send({ loginAgain: true, message: error.message })
            });
    }
};

/**
 * Attempt to refresh an access token
 *
 * Use a refresh token to regenerate an access token for a user, if the
 * refresh token is valid. This allows seamless re-login so long as the
 * refresh token is valid and not expired.
 *
 * @param {String} refreshToken Refresh token from FA application for the user.
 * @param {Object} languageData Current language information for the app. Language data object.
 */
expressMiddleware.attemptRefresh = async (refreshToken, languageData) => {
    // Make the request to the FusionAuth server and return the result as a promise.
    return new Promise(async (resolve, reject) => {
        try {
            // Send the API request.
            const response = await APIFetch.go(expressAPI.fusionAuth.refreshToken, { refreshToken });
            // The user has a valid refresh token, so return the response to be processed.
            resolve(response);
        } catch (error) {
            // Catch the response status.
            const status = error.response.status;
            // Setup a variable for the response message.
            const message = APIFetch.handleResponse(status, languageData, ["common", "express", "refreshToken", "status"]);

            // Send an error with the response status.
            reject({ status, message });
        }
    });
};

/**
 * Get the current user's information
 *
 * We could set a cookie or a session to keep track of this information, but
 * due to the importance it has in the backend services, it is worth the time spent
 * making a request to the local FusionAuth instance to grab the user's information. This
 * method also makes it easy to handle user role changes as we do not have to manually update
 * a user object or session anywhere when such changes are performed.
 */
expressMiddleware.getCurrentUser = async (req, res, next) => {
    // Language data.
    const languageData = language.getText(req.headers.locale);

    try {
        // Send the API request.
        const response = await APIFetch.go(expressAPI.fusionAuth.getUser, null, get(req, ["signedCookies", "access_token"]), false);
        // We were able to grab the user's information, so set it to req.user
        // for the remainder of the request.
        req.user = response.data.user;

        // Continue in the application.
        next();
    } catch (error) {
        // Catch the response status.
        const status = error.response.status;
        // Setup a variable for the response message.
        const message = APIFetch.handleResponse(status, languageData, ["common", "user", "profile", "status"]);

        // Check if the user no longer exists.
        const loginAgain = status === 404 ? true : null;

        // Send an error with the response status.
        res.status(status).send({ loginAgain, message });
    }
}

// Export the express middleware module.
module.exports = expressMiddleware;