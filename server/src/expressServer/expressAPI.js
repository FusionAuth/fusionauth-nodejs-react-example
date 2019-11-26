// Export the Express API.
module.exports = {
    fusionAuth: {
        validateToken: {
            PATH_SEARCH: "/api/jwt/validate",
            PATH_METHOD: "get"
        },
        refreshToken: {
            PATH_SEARCH: "/api/jwt/refresh",
            PATH_METHOD: "post"
        },
        getUser: {
            PATH_SEARCH: "/api/user",
            PATH_METHOD: "get"
        }
    }
};