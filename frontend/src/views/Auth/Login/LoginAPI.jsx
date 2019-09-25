// Export the Login API.
export default {
    fusionAuth: {
        getLogin: {
            PATH_SEARCH: "/api/login",
            PATH_METHOD: "post"
        }
    },
    apiService: {
        getLogin: {
            PATH_SEARCH: "/api/fusionAuth/login",
            PATH_METHOD: "post"
        }
    }
};