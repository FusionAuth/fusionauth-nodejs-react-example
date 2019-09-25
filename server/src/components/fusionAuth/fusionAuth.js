/**
 * FusionAuth API Module
 *
 * This is the auth handler for the frontend that allows the user to be
 * logged in and stayed logged in by setting or removing cookies when the user
 * logs in or logs out, respectively.
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

// FusionAuth API
const fusionAuthAPI = require("./fusionAuthAPI");

// Inputs
const fusionAuthInputs = require("./fusionAuthInputs.json");
const validForm = require("../../util/validForm");

/**
 * Allow the user to login.
 *
 * This function allows the user to login by setting HTTP cookies for the
 * access token and refresh token. The refresh token can be optional for
 * your application.
 */
router.post("/login", (req, res) => {
    // Set the user's cookies for persisted access.
    auth.setCookies(get(req, ["body", "refreshToken"]), get(req, ["body", "token"]), res);

    // End the request.
    res.send();
});

/**
 * Allow the user to logout.
 *
 * This function allows the user to logout by removing their cookies.
 */
router.delete("/logout", (req, res) => {
    // Remove the user's access tokens.
    auth.removeCookies(res);

    // End the request.
    res.send();
});

/**
 * User Registration
 *
 * This endpoint allows the user to register to the application. It gathers the
 * user's input from the request and uses Axios to make a request to the FusionAuth server.
 */
router.post("/registration", async (req, res) => {
    // Language data.
    const languageData = language.getText(req.headers.locale);

    // User object from the request.
    const user = {
        username: get(req, ["body", "username", "value"]),
        email: get(req, ["body", "email", "value"]),
        firstName: get(req, ["body", "firstName", "value"]),
        lastName: get(req, ["body", "lastName", "value"]),
        password: get(req, ["body", "password", "value"])
    }

    // Make sure the inputs are valid before attempting to register the user.
    if (validForm.validate(fusionAuthInputs["register"], user)) {
        // Let the user know there are form errors.
        return res.status(400).send({ message: get(languageData, ["common", "form", "fixForm"]) });
    }

    // Object for the FusionAuth user registration endpoint with the submitted data.
    const filteredBody = {
        registration: {
            applicationId: config.fusionAuth.applicationId
        },
        user
    };

    try {
        // Send the API request.
        await APIFetch.go(fusionAuthAPI.fusionAuth.postRegistration, filteredBody);
        // Result only succeeds if the user was registered, so let them know their
        // account was created.
        res.send({ message: get(languageData, ["common", "fusionAuth", "registration", "success"]) });
    } catch (error) {
        // Catch the response status.
        const status = error.response.status;
        // Setup a message variable to return.
        let message = [];

        // Check the status of the response to handle it appropriately.
        if (status === 400) {
            // Get the language information for each of the error objects.
            message = APIFetch.handleError(error.response.data.fieldErrors, user, languageData, ["common", "fusionAuth", "user", "error"]);
        } else {
            // Get the response message for the status returned by FusionAuth.
            message.push(APIFetch.handleResponse(status, languageData, ["common", "fusionAuth", "registration", "status"]));
        }

        // Send an error with the response status.
        res.status(status).send({ message });
    }
});

/**
 * Verify Registration Email
 *
 * This allows the user to verify their registration email so that they can log in
 * to the application.
 */
router.post("/verify/email", async (req, res) => {
    // Language data.
    const languageData = language.getText(req.headers.locale);
    // Verification ID
    const verificationId = get(req, ["body", "verificationId", "value"]);

    // Setup an object to have the inputs verified.
    const form = {
        verificationId
    }

    // Make sure the inputs are valid before attempting to verify the user's email.
    if (validForm.validate(fusionAuthInputs["verifyEmail"], form)) {
        // Let the user know there are form errors.
        return res.status(400).send({ message: get(languageData, ["common", "form", "fixForm"]) });
    }

    // Endpoint data for the API request.
    const endpoint = {
        PATH_SEARCH: `${fusionAuthAPI.fusionAuth.verifyEmail.PATH_SEARCH}/${ verificationId }`,
        PATH_METHOD: fusionAuthAPI.fusionAuth.verifyEmail.PATH_METHOD
    }

    try {
        // Send the API request.
        await APIFetch.go(endpoint);
        // Result only succeeds if a valid verification ID was passed, so let the user know
        // that their email was validated.
        res.send({ message: get(languageData, ["common", "fusionAuth", "verifyEmail", "success"]) });
    } catch (error) {
        // Catch the response status.
        const status = error.response.status;
        // Setup a variable for the response message.
        const message = APIFetch.handleResponse(status, languageData, ["common", "fusionAuth", "verifyEmail", "status"]);

        // Send an error with the response status.
        res.status(status).send({ message });
    }
});

/**
 * Verify 2FA
 *
 * This allows the user to verify their account with 2FA if enabled.
 */
router.post("/verify/2fa", async (req, res) => {
    // Language data.
    const languageData = language.getText(req.headers.locale);

    // Setup an object to have the inputs verified.
    const form = {
        twoFactorId: get(req, ["body", "twoFactorId", "value"]),
        code: get(req, ["body", "code", "value"])
    }

    // Make sure the inputs are valid before attempting to verify the 2FA code.
    if (validForm.validate(fusionAuthInputs["verify2Factor"], form)) {
        // Let the user know there are form errors.
        return res.status(400).send({ message: get(languageData, ["common", "form", "fixForm"]) });
    }

    // Setup the filtered JSON stringified body for the request.
    const filteredBody = {
        ...form,
        applicationId: config.fusionAuth.applicationId
    };

    try {
        // Send the API request.
        const response = await APIFetch.go(fusionAuthAPI.fusionAuth.verify2Factor, filteredBody);
        // Catch the response status.
        const status = response.status;

        // Check the status of the response since there are multiple responses that will
        // succeed, but do not mean the user should be logged in.
        if (status === 200) {
            // Set the user's cookies for persisted access.
            auth.setCookies(get(response, ["data", "refreshToken"]), get(response, ["data", "token"]), res);

            // A message is not required as the frontend takes care of the login alert.
            res.send({ user: response.data.user });
        } else {
            // Will be null if the user does not need to change their password.
            let changePasswordId = get(response, ["data", "changePasswordId"]);

            // Setup a variable for the response message.
            const message = APIFetch.handleResponse(status, languageData, ["common", "fusionAuth", "verify2Factor", "status"]);
            // Send an error with the response status.
            res.status(status).send({ changePasswordId, message });
        }
    } catch (error) {
        // Catch the response status.
        const status = error.response.status;
        // Setup a variable for the response message.
        const message = APIFetch.handleResponse(status, languageData, ["common", "fusionAuth", "verify2Factor", "status"]);

        // Send an error with the response status.
        res.status(status).send({ message });
    }
});

/**
 * Forgot Password
 *
 * This allows the user to reset their password while not logged in by sending
 * them an email with a token.
 */
router.post("/forgotPassword", async (req, res) => {
    // Language data.
    const languageData = language.getText(req.headers.locale);

    // Setup an object to have the inputs verified.
    const form = {
        loginId: get(req, ["body", "loginId", "value"])
    }

    // Make sure the inputs are valid before attempting to do the forgot password flow.
    if (validForm.validate(fusionAuthInputs["forgotPassword"], form)) {
        // Let the user know there are form errors.
        return res.status(400).send({ message: get(languageData, ["common", "form", "fixForm"]) });
    }

    try {
        // Send the API request.
        const response = await APIFetch.go(fusionAuthAPI.fusionAuth.forgotPassword, form);

        // Will be null if the user does not need to change their password.
        let changePasswordId = get(response, ["data", "changePasswordId"]);

        // Result only succeeds if the information was verified. So let the user know
        // they are allowed to change their password.
        res.send({ changePasswordId, message: get(languageData, ["common", "fusionAuth", "forgotPassword", "success"]) });
    } catch (error) {
        // Catch the response status.
        const status = error.response.status;
        // Setup a variable for the response message.
        const message = APIFetch.handleResponse(status, languageData, ["common", "fusionAuth", "forgotPassword", "status"]);

        // Send an error with the response status.
        res.status(status).send({ message });
    }
});

/**
 * Change Password - Prior to login
 *
 * This allows the user to change their password during the login workflow.
 */
router.post("/changePassword", async (req, res) => {
    // Language data.
    const languageData = language.getText(req.headers.locale);
    // Change Password ID
    const changePasswordId = get(req, ["body", "changePasswordId", "value"]);

    // Setup an object to have the inputs verified.
    const form = {
        password: get(req, ["body", "password", "value"])
    }

    // Make sure the inputs are valid before attempting to change the user's password.
    if (validForm.validate(fusionAuthInputs["changePassword"], form)) {
        // Let the user know there are form errors.
        return res.status(400).send({ message: get(languageData, ["common", "form", "fixForm"]) });
    }

    // Endpoint data for the API request.
    const endpoint = {
        PATH_SEARCH: `${fusionAuthAPI.fusionAuth.changePassword.PATH_SEARCH}/${ changePasswordId }`,
        PATH_METHOD: fusionAuthAPI.fusionAuth.changePassword.PATH_METHOD
    }

    try {
        // Send the API request.
        const response = await APIFetch.go(endpoint, form);
        // Get the one time password.
        const oneTimePassword = get(response, ["data", "oneTimePassword"]);

        // The data required to login the user with the one time password.
        const loginData = {
            applicationId: config.fusionAuth.applicationId,
            oneTimePassword
        }

        // Log in the user with the one time password.
        const loginResponse = await APIFetch.go(fusionAuthAPI.fusionAuth.login, loginData);

        // Set the user's cookies for persisted access.
        auth.setCookies(get(loginResponse, ["data", "refreshToken"]), get(loginResponse, ["data", "token"]), res);

        // Result only succeeds if the password was changed successfully.
        res.send({ user: loginResponse.data.user, message: get(languageData, ["common", "fusionAuth", "changePassword", "success"]) });
    } catch (error) {
        // Catch the response status.
        const status = error.response.status;
        // Setup a variable for the response message.
        const message = APIFetch.handleResponse(status, languageData, ["common", "fusionAuth", "changePassword", "status"]);

        // Send an error with the response status.
        res.status(status).send({ message });
    }
});

// Export the FusionAuth API module.
module.exports = router;
