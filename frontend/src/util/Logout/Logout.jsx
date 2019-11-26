/**
 * Logout Module
 *
 * Contains functions related to logging out of the application.
 */

// Dependencies
import axios from "axios";
import { get } from "lodash";

// Config
import { config } from "../../config";

// Logout API endpoints
import LogoutAPI from "./LogoutAPI";

// Declare the Logout Module.
const LogoutController = {};

/**
 * Logout the current user
 *
 * Performs a logout by requesting the API service to remove the access token
 * and refresh token cookies that were set to keep the user logged in.
 *
 * @param {String} locale The current locale of the application.
 * @param {Object} languageData Current language information for the app. Language data object.
 */
LogoutController.logout = (locale, languageData) => {
    return new Promise((resolve, reject) => {
        // Make the request to the API service.
        axios({
            baseURL: config.apiServer.BASEURL,
            url: LogoutAPI.apiService.getLogout.PATH_SEARCH,
            method: LogoutAPI.apiService.getLogout.PATH_METHOD,
            withCredentials: true,
            headers: {
                locale
            }
        }).then(() => resolve())
        .catch(() => reject(get(languageData, ["common", "auth", "logoutError"])));
    });
};

// Export the Logout Module.
export default LogoutController;