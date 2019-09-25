// Export the FusionAuth API.
module.exports = {
    fusionAuth: {
        postRegistration: {
            PATH_SEARCH: "/api/user/registration",
            PATH_METHOD: "post"
        },
        verifyEmail: {
            PATH_SEARCH: "/api/user/verify-email",
            PATH_METHOD: "post"
        },
        verify2Factor: {
            PATH_SEARCH: "/api/two-factor/login",
            PATH_METHOD: "post"
        },
        login: {
            PATH_SEARCH: "/api/login",
            PATH_METHOD: "post"
        },
        forgotPassword: {
            PATH_SEARCH: "/api/user/forgot-password",
            PATH_METHOD: "post"
        },
        changePassword: {
            PATH_SEARCH: "/api/user/change-password",
            PATH_METHOD: "post"
        }
    }
};