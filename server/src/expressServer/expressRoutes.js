/**
 * Express Routes Module
 *
 * The route module handles all incoming requests to the server and routes appropriately
 * to the correct route functions.
 */

// Middleware
const expressMiddleware = require("./expressMiddleware");

// Route info
const health = require('../components/health');
const fusionAuth = require('../components/fusionAuth');
const { roles } = require("../components/roles");
const user = require('../components/user');
const { todo } = require('../components/todo');

/**
 * Route Handler
 *
 * The function handles all routes and passes requests to their
 * appropriate route handler.
 *
 * @param {Object} app The express application
 */
const routes = app => {
    // Health check
    app.use("/health", health);

    // Authentication routes first.
    app.use("/api/fusionAuth", fusionAuth);
    // Validate JWT tokens.
    app.use(expressMiddleware.jwtValidate);
    // Grab the current user's info to ensure accurary.
    app.use(expressMiddleware.getCurrentUser);
    // Determine if a user can access a given page.
    app.use("/api/roles", roles);
    // Rest of the API endpoints.
    app.use("/api/user", user);
    app.use("/api/todo", todo);
}

// Export the express routes module.
module.exports = routes;