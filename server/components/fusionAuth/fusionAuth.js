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

/**
 * Allow the user to login.
 *
 * This function allows the user to login by setting HTTP cookies for the
 * access token and refresh token. The refresh token can be optional for
 * your application.
 */
router.post("/login", (req, res) => {
    // Cookie settings. In a production application, you want to set
    // secure: true, and if possible, sameSite: true/strict.
    const cookieSettings = { httpOnly: true, signed: true };

    // Set the JWT and refresh cookies.
    res.cookie("refresh_token", req.body.refreshToken, cookieSettings);
    res.cookie("access_token", req.body.token, cookieSettings);

    // End the request.
    res.send();
});

/**
 * Allow the user to logout.
 *
 * This function allows the user to logout by removing their cookies.
 */
router.delete("/logout", (req, res) => {
    // Cookie settings
    const cookieSettings = { httpOnly: true, signed: true };

    // Remove the JWT and refresh cookies.
    res.clearCookie("refresh_token", cookieSettings);
    res.clearCookie("access_token", cookieSettings);

    // End the request.
    res.send();
});

/**
 * User Registration
 *
 * This endpoint allows the user to register to the application. It gathers the
 * user's input from the request and uses Axios to make a request to the FusionAuth server.
 */
router.post("/registration", (req, res) => {
    // Object for the FusionAuth user registration endpoint with the submitted data.
    const filteredBody = JSON.stringify({
        registration: {
            applicationId: body.registration.applicationId
        },
        user: {
            email: body.user.email,
            firstName: body.user.firstName,
            lastName: body.user.lastName,
            password: body.user.password
        }
    });

    // Axios request to the FusionAuth server.
    axios({
        baseURL: config.fusionAuth.baseURL,
        url: userAPI.fusionAuth.postRegistration.PATH_SEARCH,
        method: userAPI.fusionAuth.postRegistration.PATH_METHOD,
        data: filteredBody,
        headers: {
            "Content-Type": "application/json",
            Authorization: config.fusionAuth.apiKey
        }
    }).then(response => {
        // Send the status of the response, because different statuses require different user
        // experiences. Send the data of the response as well.
        res.status(response.status).send(response.data);
    }).catch(err => {
        // Send a 500 error to let the user know something went wrong.
        res.status(500).send(err);
    });
});

// Export the FusionAuth API module.
module.exports = router;
