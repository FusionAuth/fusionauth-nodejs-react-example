/**
 * Auth Controller
 *
 * Contains function related to authentication within the application. It handles
 * login, logout, and page access determination for the frontend. It also manages
 * the user state so that useful information about the user can be displayed without
 * the need to query the backend or FusionAuth.
 */

// Dependencies
import axios from "axios";

// Config
import { config } from "../../config";

// Storage Key
import AuthStorage from "./AuthStorage";

// Toast
import Toasty from "../Toasty";

// Auth API endpoints
import AuthAPI from "./AuthAPI";

// Declare the Auth Controller.
const AuthController = {};

/**
 * Determine page access
 *
 * This checks whether or not a user is able to view a certain page, and this is
 * called before allowing the user to see the content of the page. This is independent
 * of any API endpoint call to obtain information for the page itself. This is used
 * over local storage to remove the frontend's ability to determine access.
 *
 * @param {string} path The path of the URL the user is trying to access.
 */
AuthController.canAccessPage = ({ path }) => {
    // Make a request to the API server and return a promise with the result.
    return new Promise((resolve, reject) => {
        axios({
            baseURL: config.apiServer.BASEURL,
            url: AuthAPI.canAccessPage.PATH_SEARCH,
            method: AuthAPI.canAccessPage.PATH_METHOD,
            withCredentials: true,
            data: {
                path
            }
        }).then(response =>
            // If the status is 200, then the user has access, otherwise, deny access.
            response.status === 200 ? resolve() : reject()
        ).catch(({ response }) => {
            // If the error message is that the user needs to login again, then we
            // want to remove their local storage (display) information.
            if (response.data.message === "You must log in again.") {
                AuthController.logout();
            }

            // Return the error message.
            return reject(response.data.message);
        });
    });
};

/**
 * Login
 *
 * Log in the user in React by setting the local storage user object. Return
 * with information useful to display a toast to the user about the operation.
 */
AuthController.login = user => {
    // Grab only the pertinent information to send to storage. We don't want everything.
    const savedUser = {
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
    }

    // Make sure the user supplied to the function is not null / empty.
    if (!user) {
        // Return with an error message for a toast event.
        return {
            toastType: Toasty.error(),
            toastMessage: "No user information available."
        };
    }

    // Make sure local stoarge is available.
    if (localStorage) {
        // Set the user object in local storage.
        localStorage.setItem(AuthStorage.user, JSON.stringify(savedUser));

        // Return information to show the user they were logged in.
        return {
            toastType: Toasty.info(),
            toastMessage: "You have been logged in."
        };
    }

    // Return a default message, unable to login.
    return {
        toastType: Toasty.error(),
        toastMessage: "Unable to save your login session."
    };
}

/**
 * Logout
 *
 * Log out the user in React by clearing the local storage. Return with information
 * useful to display a toast to the user about the operation.
 */
AuthController.logout = () => {
    // Make sure local stoarge is available and the user object is set.
    if (localStorage && localStorage.getItem(AuthStorage.user)) {
        localStorage.removeItem(AuthStorage.user);

        // Return information to show the user they were logged out.
        return {
            toastType: Toasty.info(),
            toastMessage: "You have been logged out."
        };
    }

    // Return a default message, unable to logout.
    return {
        toastType: Toasty.error(),
        toastMessage: "Unable to log you out."
    };
}

/**
 * Get User info
 *
 * Get the current user's information from local storage. Information only includes
 * basic information about the user, such as their name, email, username, etc.
 */
AuthController.user = () => {
    // Check if local storage is available and the user is set in storage.
    if (localStorage && localStorage.getItem(AuthStorage.user)) {
        // Return the parsed user object, or null if unsuccessful.
        return JSON.parse(localStorage.getItem(AuthStorage.user)) || null;
    }

    // Return null by default.
    return null;
}

// Export the Auth Controller.
export default AuthController;