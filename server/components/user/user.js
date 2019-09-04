/**
 * User API Module
 *
 * This module contains functions for the /user endpoints.
 */

// Dependencies
const axios = require("axios");
const express = require("express");
const router = express.Router();

// Config
const config = require("../../config");

// User API Endpoints
const userAPI = require("./userAPI");

/**
 * User Profile
 *
 * This endpoint returns the details of the user's profile from FusionAuth.
 */
router.get("/profile", (req, res) => {
    // Make the request to the FusionAuth server.
    axios({
        baseURL: config.fusionAuth.baseURL,
        url: userAPI.fusionAuth.getUser.PATH_SEARCH,
        method: userAPI.fusionAuth.getUser.PATH_METHOD,
        headers: {
            Authorization: `JWT ${ req.signedCookies.access_token }`
        }
    }).then(response => {
        // Send the user their data object.
        res.send({ message: response.data.user });
    }).catch(() => {
        // Let the user know that we could not grab their info.
        res.status(500).send({ message: "Unable to grab your info." });
    });
});

// Export the User API module.
module.exports = router;
