/**
 * Auth Module
 *
 * Contains function related to authentication within the application. It handles
 * login, logout, and page access determination for the frontend. It also manages
 * the user state so that useful information about the user can be displayed without
 * the need to query the backend or FusionAuth.
 */

// Dependencies
import axios from "axios";
import { get } from "lodash";

// Config
import { config, links } from "../../config";

// History
import History from "../History";

// Auth API endpoints
import AuthAPI from "./AuthAPI";

// Declare the Auth Module.
const Auth = {};

/**
 * Determine page access
 *
 * This checks whether or not a user is able to view a certain page, and this is
 * called before allowing the user to see the content of the page. This is independent
 * of any API endpoint call to obtain information for the page itself. This is used
 * over local storage to remove the frontend's ability to determine access.
 *
 * @param {Function} logoutUser Redux action to unset the user.
 * @param {string} path The path of the URL the user is trying to access.
 * @param {String} locale The current locale of the application.
 * @param {Object} languageData Current language information for the app. Language data object.
 */
Auth.canAccessPage = ({ logoutUser, path, locale, languageData }) => {
    // Make a request to the API server and return a promise with the result.
    return new Promise((resolve, reject) => {
        axios({
            baseURL: config.apiServer.BASEURL,
            url: AuthAPI.canAccessPage.PATH_SEARCH,
            method: AuthAPI.canAccessPage.PATH_METHOD,
            withCredentials: true,
            data: {
                path
            },
            headers: {
                locale
            }
        }).then(response =>
            // If the status is 200, then the user has access, otherwise, deny access.
            response.status === 200 ? resolve() : reject()
        ).catch(({ response }) => {
            // Check if the response object exists (it will not exist if the API service
            // cannot be reached).
            if (!response) {
                return reject(get(languageData, ["common", "apiDown"]));
            }

            // If the the API service says that we need to login again, do so.
            if (response.data.loginAgain) {
                logoutUser();

                // Redirect the user to the home page.
                History.push(links.home);
            }

            // Return the error message.
            return reject(response.data);
        });
    });
};

// Export the Auth Controller.
export default Auth;