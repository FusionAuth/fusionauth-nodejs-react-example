/**
 * Config Module
 *
 * The application's config for the different environments is here. We choose which information
 * to export to the application based on the environment chosen.
 */

require('dotenv').config()

// Create the config module.
const config = {
    // Environment name
    envName: process.env.NODE_ENV,
    // HTTP Port: Left as is for Docker & K8S distributions
    httpPort: 5000,
    // HTTPS Port: Left as is for Docker & K8S distributions
    httpsPort: 5001,
    cookies: {
        // UUID or Random string for cookie secret
        signedSecret: process.env.COOKIES_SIGNED_SECRET
    },
    database: {
        // Database host: ip:port or server-name.tld:port
        host: process.env.DATABASE_HOST,
        // Database usename
        user: process.env.DATABASE_USERNAME,
        // Database user password
        password: process.env.DATABASE_PASSWORD,
        // MongoDB Database name
        database: process.env.DATABASE_NAME
    },
    fusionAuth: {
        // Application API Key from FusionAuth
        apiKey: process.env.FUSIONAUTH_API_KEY,
        // Application ID from FusionAuth
        applicationId: process.env.FUSIONAUTH_APPLICATION_ID,
        // Application Secret from FusionAuth
        applicationSecret: process.env.FUSIONAUTH_APPLICATION_SECRET,
        // FusionAuth URL: http://localhost:9011
        baseURL: process.env.FUSIONAUTH_BASEURL
    },
    frontend: {
        // React APP URL: http://localhost:3000
        baseURL: process.env.FRONTEND_BASEURL
    }
};

// Export the config.
module.exports = config;