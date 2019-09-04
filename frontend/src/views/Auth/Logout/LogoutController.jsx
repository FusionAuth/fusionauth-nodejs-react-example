/**
 * Logout Controller
 *
 * Contains function related to login within the application. It handles
 * login response from the FusionAuth server and also sets the cookies with
 * the API server for subsequent requests that required authentication.
 */

// Dependencies
import axios from "axios";

// Config
import { config } from "../../../config";

// Logout API endpoints
import LogoutAPI from "./LogoutAPI";

// Declare the Logout Controller.
const LogoutController = {};

/**
 * Logout the current user
 *
 * Performs a logout by requesting the API service to remove the access token
 * and refresh token cookies that were set to keep the user logged in.
 *
 */
LogoutController.logout = () => {
    return new Promise((resolve, reject) => {
        // Make the request to the API service.
        axios({
            baseURL: config.apiServer.BASEURL,
            url: LogoutAPI.apiService.getLogout.PATH_SEARCH,
            method: LogoutAPI.apiService.getLogout.PATH_METHOD,
            withCredentials: true
        }).then(() => resolve())
        .catch(() => reject("There was an issue logging you out."));
    });
};

// Export the Logout Controller.
export default LogoutController;