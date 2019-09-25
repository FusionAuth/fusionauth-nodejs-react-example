/**
 * Entry point for the API
 *
 * This file brings in the express server and starts it when the app is initialized.
 * With this setup, you can also start background processes when the app starts.
 */

// Dependencies
const expressServer = require("./src/expressServer");

// Declare the application module.
const app = {};

/**
 * Application Initialization
 *
 * The application is initialized in this function. In this case, the application starts the
 * express server. This can be used to start background processes as well.
 */
app.init = () => {
    // Start the express server.
    expressServer.init();
}

// Start the application.
app.init();