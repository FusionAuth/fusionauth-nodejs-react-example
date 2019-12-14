// Config object
const config = {
    fusionAuth: {
        // FusionAuth URL: http://localhost:9011
        BASEURL: "http://localhost:9011",
        // Application ID from FusionAuth
        APPLICATION_ID: "10e4d908-7655-44af-abf0-1a031aff519a"
    },
    apiServer: {
        // API Server URL: http://localhost:5000
        BASEURL: "http://localhost:5000"
    },
    app: {
        // Name for the 2Factor application: FusionAuth
        TWO_FA_NAME: "fusionAuthDemoApp"
    }
};

// Export the application config.
export default config;