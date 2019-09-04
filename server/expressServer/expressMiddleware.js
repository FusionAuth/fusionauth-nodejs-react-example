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
const axios = require("axios");

// Config
const config = require("../config");

// Create the express middleware module.
const expressMiddleware = {};

/**
 * Validate a JWT
 *
 * This function will validate a user's JWT before allowing them access to any API endpoint, with
 * the exception of the FusionAuth endpoints which allow the user to log into and out of the application.
 */
expressMiddleware.jwtValidate = (req, res, next) => {
    // Make the request to the FusionAuth server.
    axios({
        baseURL: config.fusionAuth.baseURL,
        url: "/api/jwt/validate",
        method: "get",
        headers: {
            Authorization: `JWT ${ req.signedCookies.access_token }`
        }
    }).then(() => {
        // User has a valid JWT, so continue to the API.
        next();
    }).catch(error => {
        // Determine the status of the JWT validate endpoint to determine what to do.
        if (error.response.status === 401) {
            // Try to refresh the user's access token only if the old one was expired.
            if (req.signedCookies.refresh_token) {
                expressMiddleware.attemptRefresh(req.signedCookies.refresh_token)
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
                        res.status(error.status).send({ message: error.message })
                    });
            } else {
                // No refresh token is available. Make the user log in again.
                res.status(401).send({ message: "You must log in again." });
            }
        } else {
            // Server error when trying to validate access token, let them know.
            res.status(500).send({ message: "Server error (x000501)" });
        }
    });
};

/**
 * Attempt to refresh an access token
 *
 * Use a refresh token to regenerate an access token for a user, if the
 * refresh token is valid. This allows seamless re-login so long as the
 * refresh token is valid and not expired.
 */
expressMiddleware.attemptRefresh = refreshToken => {
    // Make the request to the FusionAuth server and return the result as a promise.
    return new Promise((resolve, reject) => {
        axios({
            baseURL: config.fusionAuth.baseURL,
            url: "/api/jwt/refresh",
            method: "post",
            data: {
                refreshToken
            }
        }).then(response => {
            // The user has a valid refresh token, so return the response to be processed.
            resolve(response);
        }).catch(error => {
            if (error.response.status === 401) {
                // The user's refresh token is expired or invalid, make them login again.
                reject({ status: 401, message: "You must log in again." });
            } else {
                // Some sort of server error, make sure they do not advance in the application.
                reject({ status: 500, message: "Server error (x000502)" });
            }
        });
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
expressMiddleware.getCurrentUser = (req, res, next) => {
    axios({
        baseURL: config.fusionAuth.baseURL,
        url: "/api/user",
        method: "get",
        headers: {
            Authorization: `JWT ${ req.signedCookies.access_token }`
        }
    }).then(response => {
        // We were able to grab the user's information, so set it to req.user
        // for the remainder of the request.
        req.user = response.data.user;

        // Continue in the application.
        next();
    }).catch(() => {
        // Server error when trying to grab the user's info, let them know.
        res.status(500).send({ message: "Server error (x000503)" });
    });
}

// Export the express middleware module.
module.exports = expressMiddleware;