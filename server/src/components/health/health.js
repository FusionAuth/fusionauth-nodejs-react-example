/**
 * Health Module
 *
 * This module contains functions for the /health endpoint.
 */

// Dependencies
const express = require("express");
const router = express.Router();
const { get } = require("lodash");

// Language
const language = require("../../util/language");

/**
 * Health Check
 *
 * Returns a 200 status ok so services know the API is available.
 */
router.get("/", (req, res) => {
    // Language data.
    const languageData = language.getText(req.headers.locale);

    // Send a 200 status ok response with text saying the API is available. Defaults
    // to an English message.
    res.send({ message: get(languageData, ["common", "app", "available"]) });
});

// Export the User API module.
module.exports = router;
