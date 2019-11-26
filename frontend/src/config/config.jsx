// Config object
const config = {
    fusionAuth: {
        // FusionAuth URL: http://localhost:9011
        BASEURL: "https://auth.vibravid.io",
        // Application ID from FusionAuth
        APPLICATION_ID: "APPLICATION_ID"
    },
    apiServer: {
        // API Server URL: http://localhost:5000
        BASEURL: "http://localhost:5000"
    },
    app: {
        // Name for the 2Factor application: FusionAuth
        TWO_FA_NAME: "AppName"
    }
};

// Export the application config.
export default config;