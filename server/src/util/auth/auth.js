/**
 * Auth Module
 *
 * This module handles authentication requirements for the API Service.
 */

// Declare the Auth module
const auth = {};

/**
 * Set refresh and access tokens
 *
 * Allows refresh and access tokens to be set so that the user has persisted access
 * to the application.
 *
 * @param {String} refreshToken FA refresh token.
 * @param {String} accessToken FA access token.
 * @param {Object} res The response object of the request.
 */
auth.setCookies = (refreshToken, accessToken, res) => {
    // Cookie settings. In a production application, you want to set
    // secure: true, and if possible, sameSite: true/strict.
    const cookieSettings = { httpOnly: true, signed: true };

    // Set the JWT and refresh cookies.
    res.cookie("refresh_token", refreshToken, cookieSettings);
    res.cookie("access_token", accessToken, cookieSettings);
}

/**
 * Remove refresh and access tokens
 *
 * Removes the access and refresh token so that the user will no longer have access
 * to the application.
 *
 * @param {Object} res The response object of the request.
 */
auth.removeCookies = (res) => {
    // Cookie settings
    const cookieSettings = { httpOnly: true, signed: true };

    // Remove the JWT and refresh cookies.
    res.clearCookie("refresh_token", cookieSettings);
    res.clearCookie("access_token", cookieSettings);
}

// Export the Auth module.
module.exports = auth;