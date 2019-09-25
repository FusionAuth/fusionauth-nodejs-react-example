/**
 * Express Server Module
 *
 * This is the express server module which handles setting up middleware, starting
 * the HTTP / HTTPS server, and setting up the route listeners.
 */

// Dependencies
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const passport = require('passport');
const routes = require("./expressRoutes");
const database = require("../database");

// Config
const config = require("../config");

// Create the express object
const app = express();

// Declare the express server module
const expressServer = {};

/**
 * Setup the middleware for the application.
 *
 * This will process the middleware for the application before we start listening for requests.
 * It will also return a promise so that we can wait for everything to be processed.
 */
expressServer.setMiddleware = () => {
    return new Promise(resolve => {
        // Setup the CORS policy with multi-domain capability.
        app.use(
            cors({
                origin: (origin, callback) => {
                    if (config.frontend.baseURL.includes(origin) || !origin) {
                        callback(null, true);
                    } else {
                        callback(null, false);
                    }
                },
                credentials: true,
                exposedHeaders: "Access-Control-Allow-Origin,Access-Control-Allow-Credentials"
            })
        );
        // Setup body parser to easily parse incoming data.
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
        // Setup the ability to use signed cookies.
        app.use(cookieParser(config.cookies.signedSecret));
        // Initialize passport authentication.
        app.use(passport.initialize());
        resolve();
    });
}

/**
 * Start the HTTP server.
 *
 * We start the HTTP server in this function and return a promise for the calling
 * function. We reject out of the function if we were unable to start the server
 * so that the application will exit.
 */
expressServer.httpServer = () => {
    /**
     * Start the express server on the HTTP port for the chosen environment.
     *
     * Resolve the promise once the server is up and running, or reject if there is an error.
     */
    return new Promise((resolve, reject) => {
        app.listen(config.httpPort, "0.0.0.0", err => {
            if (err) {
                // Reject and log the error.
                reject();
                return console.log(`Error: ${ err }`);
            }

            // Log the server start and resolve.
            console.log("\x1b[36m%s\x1b[0m", `Running a ${config.envName} environment on port ${config.httpPort}`);
            resolve();
        });
    });
}

/**
 * Start the HTTPS server.
 *
 * We require the private key and fullchain files in order to run the express
 * server over HTTPS. A promise is returned for the calling function. We reject
 * out of the function if we were unable to start the server so that the
 * application will exit.
 */
expressServer.httpsServer = () => {
    /**
     * Start the express server on the HTTPS port for the chosen environment.
     *
     * Resolve the promise once the server is up and running, or reject if there is an error.
     */
    return new Promise((resolve, reject) => {
        // Grab the SSL certificate files in order to start the HTTPS server.
        https.createServer({
            key: fs.readFileSync("/path/to/privkey.pem"),
            cert: fs.readFileSync("/path/to/fullchain.pem"),
            ca: fs.readFileSync("/path/to/fullchain.pem"),
        }, app).listen(config.httpsPort, "0.0.0.0", err => {
            if (err) {
                // Return from the function with an error.
                console.log(`Error: ${ err }`);
                return reject();
            }

            // Log the HTTPS server start and resolve.
            console.log("\x1b[36m%s\x1b[0m", `Running a ${config.envName} environment on port ${config.httpsPort}`);
            resolve();
        });
    })
};

/**
 * Start the HTTP / HTTPS server.
 *
 * This will start both HTTP and HTTPS servers (if needed). Once the servers are running, then
 * the routes are included and passed the express object in order to listen for requests.
 */
expressServer.startListeners = async () => {
    // Attempt to connect to the database before starting the HTTP / HTTPS servers.
    database.connect()
    .then(async () => {
        // Log connection to database.
        console.log("Database connected");

        // Start the HTTP server and await its response.
        await expressServer.httpServer()
            .catch(() => process.exit(1));
        // Start the HTTPS server and await its response.
        // await expressServer.httpsServer()
        //     .catch(() => process.exit(2));

        // Pass the express application to the routes object.
        routes(app);
    }).catch(() =>
        // Error in connecting to the database, so exit the application.
        process.exit(1)
    );
}

/**
 * Initialize the express server module.
 *
 * This will start the middleware for the server, which returns a promise. Once the middleware are set, then
 * the listeners will be setup. Finally, the routes will be passed the app object and be ready to listen for
 * requests.
 */
expressServer.init = () => {
    // Wait for the middleware to be processed before we start the HTTP / HTTPS listeners.
    expressServer.setMiddleware()
        .then(() => expressServer.startListeners());
}

// Export the express server module.
module.exports = expressServer;