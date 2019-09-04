/**
 * Todo API Module
 *
 * This module contains functions for the /todo endpoints.
 */

// Dependencies
const express = require("express");
const router = express.Router();
const { isEmpty } = require("lodash");

// Config
const config = require("../../config");

// Model
const todoModel = require("./todoModel");

/**
 * Get current user Todos
 *
 * This will grab all Todos for the current user.
 */
router.get("/", (req, res) => {
    // Grab the user id from the request object set in the middleware.
    const userID = req.user.id;

    // Use the Roles Model to find the route in question, sent in the body of the request.
    todoModel
        .find({ userID })
        .then(todos => {
            if (!isEmpty(todos)) {

            } else {
                // Let the user know that there are no Todos in their list.
                res.status(430).send({ message: "No Todos created yet." });
            }
        })
        .catch(() => res.status(401).send({ message: "Server error. (x000504)" }))
});

/**
 * Add Todo
 *
 * This will add a Todo for the current user.
 */
router.post("/", (req, res) => {
    // Grab the user id from the request object set in the middleware.
    const userID = req.user.id;

    // Use the Roles Model to find the route in question, sent in the body of the request.
    todoModel
        .find({ userID })
        .then(todos => {
            if (!isEmpty(todos)) {

            } else {
                // Let the user know that there are no Todos in their list.
                res.status(430).send({ message: "No Todos created yet." });
            }
        })
        .catch(() => res.status(401).send({ message: "Server error. (x000504)" }))
});

// Export the User API module.
module.exports = router;
