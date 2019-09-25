/**
 * ToDo API Module
 *
 * This module contains functions for the /api/todo endpoints.
 */

// Dependencies
const express = require("express");
const router = express.Router();
const { get, isEmpty } = require("lodash");

// Model
const todoModel = require("./todoModel");

// Inputs
const todoInputs = require("./todoInputs.json");
const validForm = require("../../util/validForm");

// Language
const language = require("../../util/language");

/**
 * Get all current user Todos
 *
 * This will grab all Todos for the current user.
 */
router.get("/", (req, res) => {
    // Grab the user id from the request object set in the middleware.
    const userID = req.user.id;
    // Language data.
    const languageData = language.getText(req.headers.locale);

    // Use the ToDo Model to find the ToDo items for the logged in user.
    todoModel
        .find({ userID })
        .then(todos => {
            if (!isEmpty(todos)) {
                // Send the user their ToDo items.
                res.send({ content: todos });
            } else {
                // Let the user know that there are no Todos in their list.
                res.status(250).send({ message: get(languageData, ["common", "todo", "noTodos"]) });
            }
        })
        .catch(() => {
            // Let the user know that there was an error in grabbing their ToDo items.
            res.status(500).send({ message: get(languageData, ["common", "todo", "error", "list"]) });
        });
});

/**
 * Add Todo
 *
 * This will add a ToDo item for the current user.
 */
router.post("/", (req, res) => {
    // Grab the user id from the request object set in the middleware.
    const userID = req.user.id;
    // Language data.
    const languageData = language.getText(req.headers.locale);

    // Setup the ToDo object that needs to be validated.
    const todoItem = {
        name: req.body.name.value,
        description: req.body.description.value,
        done: false
    }

    // Make sure the inputs are valid before attempting to save the ToDo object.
    if (validForm.validate(todoInputs, todoItem)) {
        // Let the user know there are form errors.
        return res.status(400).send({ message: get(languageData, ["common", "form", "fixForm"]) });
    }

    // Setup the ToDo object to save.
    const todo = new todoModel({
        ...todoItem,
        userID
    });

    // Save the ToDo
    todo
        .save()
        .then(() => {
            // Let the user know that their ToDo was saved.
            res.send({ message: get(languageData, ["common", "todo", "created"]) });
        })
        .catch(() => {
            // Let the user know that there was an error in trying to save their ToDo item.
            res.status(500).send({ message: get(languageData, ["common", "todo", "error", "add"]) });
        });
});

/**
 * Edit Todo
 *
 * This allow a user to edit their own ToDo item.
 */
router.put("/", async (req, res) => {
    // Grab the user id from the request object set in the middleware.
    const userID = req.user.id;
    // Language data.
    const languageData = language.getText(req.headers.locale);

    // Get form data.
    const todoID = req.body._id.value;

    // Setup the ToDo object that needs to be validated.
    const todoItem = {
        name: req.body.name.value,
        description: req.body.description.value,
        done: req.body.done.value
    }

    // Make sure the inputs are valid before attempting to edit the ToDo object.
    if (validForm.validate(todoInputs, todoItem)) {
        // Let the user know there are form errors.
        return res.status(400).send({ message: get(languageData, ["common", "form", "fixForm"]) });
    }

    try {
        // Attempt to find the ToDo with the ID.
        const todo = await todoModel.findOne({ _id: todoID });

        // Make sure this user is the owner of the ToDo item.
        if (todo.userID === userID) {
            // Attempt to update the ToDo item.
            await todoModel.updateOne({ _id: todoID }, todoItem);

            // Let the user know that the item was updated.
            res.send({ message: get(languageData, ["common", "todo", "updated"]) });
        } else {
            // Let the user know that they are not the owner of the ToDo Item.
            res.status(403).send({ message: get(languageData, ["common", "todo", "ownerNotYou"]) });
        }
    } catch (error) {
            // Let the user know that there was an error in trying to update their ToDo item.
        res.status(500).send({ message: get(languageData, ["common", "todo", "error", "update"]) });
    }
});

/**
 * Delete ToDo
 *
 * This will allow a user to delete a ToDo item as long as they are the owner.
 */
router.delete("/", async (req, res) => {
    // Grab the user id from the request object set in the middleware.
    const userID = req.user.id;
    // Language data.
    const languageData = language.getText(req.headers.locale);
    // Get the ToDo's ID from the query.
    const todoID = req.query.id;

    try {
        // Attempt to find the ToDo with the ID.
        const todo = await todoModel.findOne({ _id: todoID });

        // Make sure the todo exists.
        if (!todo) {
            return res.status(410).send({ message: get(languageData, ["common", "todo", "dne"]) });
        }

        // Make sure this user is the owner of the ToDo item.
        if (todo.userID === userID) {
            // Attempt to delete the ToDo with the given ID.
            await todoModel.deleteOne({ _id: todoID });

            // Let the user know the item was deleted.
            res.send({ message: get(languageData, ["common", "todo", "deleted"]) });
        } else {
            // Let the user know that they are not the owner of the ToDo Item.
            res.status(403).send({ message: get(languageData, ["common", "todo", "ownerNotYou"]) });
        }
    } catch (error) {
        // Handle all errors with a server error message.
        res.status(500).send({ message: get(languageData, ["common", "todo", "error", "delete"]) });
    }
});

/**
 * Get current user's Todo for the requested ID
 *
 * This will grab information about the ToDo for the requested ID and
 * return the information so long as the requester is the owner.
 */
router.get("/one", async (req, res) => {
    // Grab the user id from the request object set in the middleware.
    const userID = req.user.id;
    // Language data.
    const languageData = language.getText(req.headers.locale);
    // Get the ToDo's ID from the query.
    const todoID = req.query.id;

    try {
        // Attempt to find the ToDo with the ID.
        const todo = await todoModel.findOne({ _id: todoID });

        // Make sure the todo exists.
        if (!todo) {
            return res.status(410).send({ message: get(languageData, ["common", "todo", "dne"]) });
        }

        // Make sure this user is the owner of the ToDo item.
        if (todo.userID === userID) {
            // Send the ToDo back to the user.
            res.send({ content: todo });
        } else {
            // Let the user know that they are not the owner of the ToDo Item.
            res.status(403).send({ message: get(languageData, ["common", "todo", "ownerNotYou"]) });
        }
    } catch (error) {
        if (error.name === "CastError") {
            // Let the user know that the ToDo item with the provided ID does not exist.
            res.status(410).send({ message: get(languageData, ["common", "todo", "dne"]) });
        } else {
            // Handle all other errors.
            res.status(500).send({ message: get(languageData, ["common", "todo", "error", "get"]) });
        }
    }
});

// Export the ToDo API module.
module.exports = router;
