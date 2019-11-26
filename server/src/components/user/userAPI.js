// Export the User API.
module.exports = {
    fusionAuth: {
        getUser: {
            PATH_SEARCH: "/api/user",
            PATH_METHOD: "get"
        },
        login: {
            PATH_SEARCH: "/api/login",
            PATH_METHOD: "post"
        },
        changePassword: {
            PATH_SEARCH: "/api/user/change-password",
            PATH_METHOD: "post"
        },
        get2Factor: {
            PATH_SEARCH: "/api/two-factor/secret",
            PATH_METHOD: "get"
        },
        postEnable2Factor: {
            PATH_SEARCH: "/api/user/two-factor",
            PATH_METHOD: "post"
        },
        deleteDisable2Factor: {
            PATH_SEARCH: "/api/user/two-factor",
            PATH_METHOD: "delete"
        },
        saveProfile: {
            PATH_SEARCH: "/api/user",
            PATH_METHOD: "put"
        }
    }
};