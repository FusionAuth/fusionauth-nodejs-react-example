/**
 * Login Controller
 *
 * Contains functions related to login within the application. It handles
 * login response from the FusionAuth server and also sets the cookies with
 * the API server for subsequent requests that required authentication.
 */

// Dependencies
import axios from "axios";
import { get } from "lodash";

// Config & Application Links
import { config, links } from "../../../config";

// Login API endpoints
import LoginAPI from "./LoginAPI";

// Response Handler
import ResponseHandler from "../../../util/ResponseHandler";

// Declare the Login Controller.
const LoginController = {};

/**
 * Determine post login action (from FusionAuth)
 *
 * Function takes in the status of the login response in order to
 * determine the post login action to be taken, whether that is to
 * display an error message, or to redirect the user. A promise is used
 * to redirect the user while reject is used to display a message.
 *
 * @param {number} response The response from the API request.
 * @param {Object} languageData Current language information for the app. Language data object.
 */
LoginController.handleResponse = async (response, languageData) => {
    // Base path for language keys for the statuses.
    const langKey = ["common", "auth", "login", "status"];
    // Redirect data for the redirectable statuses.
    const redirectData = {
        "200": {
            redirect: links.home
        },
        "203":{
            redirect: links.auth.changePassword,
            alert: true
        },
        "242": {
            redirect: links.auth.twoFactor,
            alert: true
        }
    };
    // Alert data information for statuses. All statuses in this case use
    // the `danger` type, so we default all statuses to this with `500` as the key.
    const alertData = {
        "500": "danger"
    }

    // Return a promise with the results.
    return new Promise(async (resolve, reject) => {
        try {
            // Resolve with the redirect link.
            resolve(await ResponseHandler.status({ response, apiMessage: false, languageData, langKey, redirectData, alertData }));
        } catch (error) {
            // Reject with the error object.
            reject(error);
        }
    });
};

/**
 * Handle Login Actions
 *
 * Uses the custom Response Handler to handle login actions.
 *
 * @param {Object} responseObject Response object from the request with alert info or redirect info.
 * @param {Object} data Data object required for handling the action.
 * @param {Function} action Redux action to handle data.
 */
LoginController.handleAction = (responseObject, data, action) => {
    // Add additional content to the response object to be handled.
    responseObject = {
        ...responseObject,
        setUser: true,
        from: "changePassword"
    }

    // Use the custom Response Handler to determine what to do with the user.
    const response = ResponseHandler.action(responseObject, data, action);

    // Check if there are any errors to display.
    if (get(response, "type")) {
        // Return the error information.
        return response;
    } else {
        // No error, so the user was redirected.
        return false;
    }
}

/**
 * Set cookies on successful login
 *
 * Function makes a request to the backend API service to set cookies
 * for future requests in order to allow the user to access the API endpoints
 * for the application.
 *
 * @param {string} refreshToken User refresh token from the login response.
 * @param {string} token User access token from the login response.
 * @param {String} locale The current locale of the application.
 * @param {Object} languageData Current language information for the app. Language data object.
 */
LoginController.setCookies = (refreshToken, token, locale, languageData) => {
    // Return a promise with the redirect url or the error response.
    return new Promise((resolve, reject) => {
        axios({
            baseURL: config.apiServer.BASEURL,
            url: LoginAPI.apiService.getLogin.PATH_SEARCH,
            method: LoginAPI.apiService.getLogin.PATH_METHOD,
            withCredentials: true,
            data: {
                refreshToken,
                token
            },
            headers: {
                locale
            }
        }).then(() => {
            resolve({ redirect: links.home })
        }).catch(() => reject(get(languageData, ["common", "auth", "failedLogin"])));
    });
};

// Export the Login Controller.
export default LoginController;