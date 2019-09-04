/**
 * Login Controller
 *
 * Contains function related to login within the application. It handles
 * login response from the FusionAuth server and also sets the cookies with
 * the API server for subsequent requests that required authentication.
 */

// Dependencies
import axios from "axios";

// Config & Application Links
import { config, links } from "../../../config";

// Login API endpoints
import LoginAPI from "./LoginAPI";

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
 * @param {number} status Numeric status of the login response.
 */
LoginController.loginResponse = status => {
    return new Promise((resolve, reject) => {
        switch (status) {
            case 200:
                // User is valid, let them go to the homepage.
                resolve({ redirect: links.home });
                break;
            case 202:
                // User does not have access to the application.
                reject({
                    alertType: "danger",
                    alertMessage: "You are not authorized to login."
                });
                break;
            case 203:
                // User needs to change their password.
                resolve({ redirect: links.auth.changePassword });
                break;
            case 242:
                // User needs to validate themselves with 2FA.
                resolve({ redirect: links.auth.fa2 });
                break;
            case 400:
                // The request body to FusionAuth is incomplete (likely did not fill out form).
                reject({
                    alertType: "danger",
                    alertMessage: "Make sure you fill out the form to login."
                });
                break;
            case 404:
                // Invalid username or password.
                reject({
                    alertType: "danger",
                    alertMessage: "Invalid username or password."
                });
                break;
            case 409:
                // Some FusionAuth action prevents login at this time for the user.
                reject({
                    alertType: "danger",
                    alertMessage: "You cannot login at this time."
                });
                break;
            default:
                // Capture all other responses as server errors.
                reject({
                    alertType: "danger",
                    alertMessage: `Server error ${ status }. We could not log you in.`
                });
        }
    });
};

/**
 * Set cookies on successful login
 *
 * Function makes a request to the backend API service to set cookies
 * for future requests in order to allow the user to access the API endpoints
 * for the application.
 *
 * @param {string} refreshToken User refresh token from the login response.
 * @param {string} token User access token from the login response.
 */
LoginController.setCookies = (refreshToken, token) => {
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
            }
        }).then(() => {
            resolve({ redirect: links.home })
        }).catch(() => reject("There was an issue logging you in."));
    });
};

// Export the Login Controller.
export default LoginController;