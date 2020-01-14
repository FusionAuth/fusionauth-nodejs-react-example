/**
 * Database Module
 *
 * Handle database actions for the application.
*/

// Dependencies
const mongoose = require("mongoose");

// Config
const config = require("../config");

// Shorthand for database proprties.
const db = config.database;

// Create the Database Module.
const database = {};

/**
 * Connect to the database
 *
 * Attempt to connect to the database with the credentials and database provided. Make
 * sure we use "useNewUrlParser" in the options due to Mongo v4.
 */
database.connect = () => {
    // Return a promise (resolved) after a successful connection, or reject
    // if there was an error connecting to the database.
    return new Promise((resolve, reject) => {
        mongoose.connect(`mongodb+srv://${ db.user }:${ db.password }@${ db.host }/${ db.database }`, { useCreateIndex: true, useNewUrlParser: true })
        .then(() => resolve())
        .catch(() => reject());
    });
};

// Export the Database Module.
module.exports = database;