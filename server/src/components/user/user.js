/**
 * User API Module
 *
 * This module contains functions for the /api/user endpoints.
 */

// Dependencies
const express = require("express");
const router = express.Router();
const { get } = require("lodash");

// Config
const config = require("../../config");

// API Fetch
const APIFetch = require("../../util/apiFetch");

// Language
const language = require("../../util/language");

// Auth
const auth = require("../../util/auth");

// User API Endpoints
const userAPI = require("./userAPI");

// Inputs
const userInputs = require("./userInputs.json");
const validForm = require("../../util/validForm");

/**
 * View User Profile
 *
 * This endpoint returns the details of the user's profile from FusionAuth.
 */
router.get("/profile", async (req, res) => {
    // Language data.
    const languageData = language.getText(req.headers.locale);

    try {
        // Send the API request.
        const response = await APIFetch.go(userAPI.fusionAuth.getUser, null, get(req, ["signedCookies", "access_token"]), false);
        // Result only succeeds if a user could be found, so send the user data.
        res.send({ content: response.data.user });
    } catch (error) {
        // Catch the response status.
        const status = error.response.status;
        // Setup a variable for the response message.
        const message = APIFetch.handleResponse(status, languageData, ["common", "user", "profile", "status"]);

        // Send an error with the response status.
        res.status(status).send({ message });
    }
});

/**
 * Edit User Profile
 *
 * This endpoint returns the details of the user's profile from FusionAuth.
 */
router.put("/profile", async (req, res) => {
    // Get the user object from the request.
    const user = req.user;
    // Language data.
    const languageData = language.getText(req.headers.locale);

    // User object from the request.
    const form = {
        username: get(req, ["body", "username", "value"]),
        email: get(req, ["body", "email", "value"]),
        firstName: get(req, ["body", "firstName", "value"]),
        lastName: get(req, ["body", "lastName", "value"]),
        mobilePhone: get(req, ["body", "mobilePhone", "value"])
    }

    // Make sure the inputs are valid before attempting to save the user's profile.
    if (validForm.validate(userInputs["saveProfile"], form)) {
        // Let the user know there are form errors.
        return res.status(400).send({ message: get(languageData, ["common", "form", "fixForm"]) });
    }

    // Endpoint data for the API request.
    const endpoint = {
        PATH_SEARCH: `${ userAPI.fusionAuth.saveProfile.PATH_SEARCH }/${ user.id }`,
        PATH_METHOD: userAPI.fusionAuth.saveProfile.PATH_METHOD
    }

    try {
        // Setup the filtered JSON stringified body for the request.
        const filteredBody = {
            user: {
                ...user,
                ...form
            }
        };

        // Send the API request.
        const response = await APIFetch.go(endpoint, filteredBody);
        // Result only succeeds if the user's profile has been updated.
        res.send({ user: response.data.user, message: get(languageData, ["common", "user", "saveProfile", "success"]) });
    } catch (error) {
        // Catch the response status.
        const status = error.response.status;
        // Setup a message variable to return.
        let message = [];

        // Check the status of the response to handle it appropriately.
        if (status === 400) {
            // Get the language information for each of the error objects.
            message = APIFetch.handleError(error.response.data.fieldErrors, form, languageData, ["common", "user", "saveProfile", "error"]);
        } else {
            // Get the response message for the status returned by FusionAuth.
            message.push(APIFetch.handleResponse(status, languageData, ["common", "user", "saveProfile", "status"]));
        }

        // Send an error with the response status.
        res.status(status).send({ message });
    }
});

/**
 * Change Password -  Current User
 *
 * This allows the user to change their password if they're already logged in.
 */
router.post("/changePassword", async (req, res) => {
    // Language data.
    const languageData = language.getText(req.headers.locale);
    // Refresh token.
    const accessToken = get(req, ["signedCookies", "access_token"]);

    // Setup an object to have the inputs verified.
    const form = {
        currentPassword: get(req, ["body", "currentPassword", "value"]),
        password: get(req, ["body", "password", "value"])
    }

    // Make sure the inputs are valid before attempting to change the user's password.
    if (validForm.validate(userInputs["changePassword"], form)) {
        // Let the user know there are form errors.
        return res.status(400).send({ message: get(languageData, ["common", "form", "fixForm"]) });
    }

    try {
        // Setup the filtered JSON stringified body for the request.
        const filteredBody = {
            ...form,
            applicationId: config.fusionAuth.applicationId
        };

        // Send the API request.
        const response = await APIFetch.go(userAPI.fusionAuth.changePassword, filteredBody, accessToken);
        // Get the one time password.
        const oneTimePassword = get(response, ["data", "oneTimePassword"]);

        // The data required to login the user with the one time password.
        const loginData = {
            applicationId: config.fusionAuth.applicationId,
            oneTimePassword
        }

        // Log in the user with the one time password.
        const loginResponse = await APIFetch.go(userAPI.fusionAuth.login, loginData);

        // Set the user's cookies for persisted access.
        auth.setCookies(get(loginResponse, ["data", "refreshToken"]), get(loginResponse, ["data", "token"]), res);

        // Result only succeeds if the password was changed successfully.
        res.send({ user: loginResponse.data.user, message: get(languageData, ["common", "user", "changePassword", "success"]) });
    } catch (error) {
        // Catch the response status.
        const status = error.response.status;
        // Setup a variable for the response message.
        const message = APIFetch.handleResponse(status, languageData, ["common", "user", "changePassword", "status"]);

        // Send an error with the response status.
        res.status(status).send({ message });
    }
});

/**
 * Get User 2FA Settings
 *
 * This endpoint returns either the user's 2FA status if enabled, or provides
 * the information necessary to enable 2FA.
 */
router.get("/2fa", async (req, res) => {
    // Language data.
    const languageData = language.getText(req.headers.locale);

    try {
        // Send the API request.
        const response = await APIFetch.go(userAPI.fusionAuth.getUser, null, get(req, ["signedCookies", "access_token"]), false);

        // Get the user's 2FA status.
        const twoFactorStatus = response.data.user.twoFactorEnabled;

        // Check if the user has 2FA enabled to determine what to send.
        if (!twoFactorStatus) {
            // Send the API request.
            const twoFactor = await APIFetch.go(userAPI.fusionAuth.get2Factor);
            // Get the generated secret.
            const twoFactorData = twoFactor.data;
            res.send({ content: { ...twoFactorData, email: response.data.user.email }, twoFA: false });
        } else {
            res.send({ message: twoFactorStatus, content: response.data.user, twoFA: true });
        }
    } catch (error) {
        // Catch the response status.
        const status = error.response.status;
        // Setup a variable for the response message.
        const message = APIFetch.handleResponse(status, languageData, ["common", "user", "profile", "status"]);

        // Send an error with the response status.
        res.status(status).send({ message });
    }
});

/**
 * Enable User 2FA
 *
 * This endpoint allows users to enable 2FA for their account.
 */
router.post("/2fa", async (req, res) => {
    // Language data.
    const languageData = language.getText(req.headers.locale);

    // Setup an object to have the inputs verified.
    const form = {
        code: get(req, ["body", "code", "value"]),
        secret: get(req, ["body", "secret", "value"])
    }

    // Make sure the inputs are valid before attempting to enable 2FA.
    if (validForm.validate(userInputs["enable2Factor"], form)) {
        // Let the user know there are form errors.
        return res.status(400).send({ message: get(languageData, ["common", "form", "fixForm"]) });
    }

    try {
        // Setup the filtered JSON stringified body for the request.
        const filteredBody = {
            ...form,
            delivery: "None"
        };

        // Endpoint data for the API request.
        const endpoint = {
            PATH_SEARCH: `${userAPI.fusionAuth.postEnable2Factor.PATH_SEARCH}/${ req.user.id }`,
            PATH_METHOD: userAPI.fusionAuth.postEnable2Factor.PATH_METHOD
        }

        // Send the API request.
        await APIFetch.go(endpoint, filteredBody);

        // Response will only succeed if 2FA was enabled for the user.
        res.send({ message: get(languageData, ["common", "user", "enable2FA", "success"]) });
    } catch (error) {
        // Catch the response status.
        const status = error.response.status;
        // Setup a variable for the response message.
        const message = APIFetch.handleResponse(status, languageData, ["common", "user", "enable2FA", "status"]);

        // Send an error with the response status.
        res.status(status).send({ message });
    }
});

/**
 * Disable User 2FA
 *
 * This endpoint allows users to disable 2FA for their account.
 */
router.delete("/2fa", async (req, res) => {
    // Language data.
    const languageData = language.getText(req.headers.locale);
    // Get the 2FA code.
    const code = get(req, ["body", "code", "value"]);

    // Setup an object to have the inputs verified.
    const form = {
        code
    }

    // Make sure the inputs are valid before attempting to disable 2FA.
    if (validForm.validate(userInputs["disable2Factor"], form)) {
        // Let the user know there are form errors.
        return res.status(400).send({ message: get(languageData, ["common", "form", "fixForm"]) });
    }

    try {
        // Endpoint data for the API request.
        const endpoint = {
            PATH_SEARCH: `${userAPI.fusionAuth.deleteDisable2Factor.PATH_SEARCH}/${ req.user.id }?code=${ code }`,
            PATH_METHOD: userAPI.fusionAuth.deleteDisable2Factor.PATH_METHOD
        }

        // Send the API request.
        await APIFetch.go(endpoint, {});

        // Response will only succeed if 2FA was disabled for the user.
        res.send({ message: get(languageData, ["common", "user", "disable2FA", "success"]) });
    } catch (error) {
        // Catch the response status.
        const status = error.response.status;
        // Setup a variable for the response message.
        const message = APIFetch.handleResponse(status, languageData, ["common", "user", "disable2FA", "status"]);

        // Send an error with the response status.
        res.status(status).send({ message });
    }
});

// Export the User API module.
module.exports = router;
