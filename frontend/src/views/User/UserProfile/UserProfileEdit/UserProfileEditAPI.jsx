// Export the User Profile Edit API.
export default {
    apiService: {
        getProfile: {
            PATH_SEARCH: "/api/user/profile",
            PATH_METHOD: "get"
        },
        putProfile: {
            PATH_SEARCH: "/api/user/profile",
            PATH_METHOD: "put"
        }
    }
};