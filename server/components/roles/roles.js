/**
 * Roles API Module
 *
 * This module contains functions for the /role endpoints.
 */

// Dependencies
const express = require("express");
const router = express.Router();

// Config
const config = require("../../config");

// Model
const rolesModel = require("./rolesModel");

/**
 * Determine page access
 *
 * This is a method the frontend uses to determine whether or not a user is
 * able to view a page in the application.
 */
router.post("/canAccessPage", (req, res) => {
    // Grab the user registrations from the request object set in the middleware.
    const registrations = req.user.registrations;
    // Filter out the applications that aren't the one specified in the config.
    const application = registrations.filter(registration => registration.applicationId === config.fusionAuth.applicationId);
    // There should only be one object in the resulting array, since IDs are unique. Grab the
    // roles from that object.
    const userRoles = application[0].roles;

    // Use the Roles Model to find the route in question, sent in the body of the request.
    rolesModel
        .findOne({ route: req.body.path })
        .then(route => {
            // Loop through the read roles to see if the user has one of them.
            for (const allowedReadRole of route.read) {
                // Check if the looped role is included in the user's selection of roles.
                if (userRoles.includes(allowedReadRole)) {
                    // Send a 200 OK result if the user has one of the allowed read roles for the page.
                    res.status(200).send();
                    // Return, stop looping.
                    return;
                }
            }

            // Send a 401 Unauthorized error if the user does not have access.
            res.status(401).send({ message: "Not Authorized." });
        })
        .catch(() => res.status(401).send({ message: "Not Authorized." }));
});

// Export the User API module.
module.exports = router;
