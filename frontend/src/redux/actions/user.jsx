/**
 * User Actions
 *
 * Action creators for User based actions.
 */

// Dependencies
import { get } from "lodash";

// Toasty
import Toasty from "../../util/Toasty";

// Action Types
import { SET_USER, LOGOUT_USER } from "../actionTypes";

/**
 * Set the User Object
 *
 * Attempt to set the user object with data about the user.
 *
 * @param {Object} user The user object returned from FusionAuth /api/login.
 */
const setUser = user => (dispatch, getState) => {
    // Grab only the pertinent information to send to storage. We don't want everything.
    const savedUser = {
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
    }

    // Make sure the user supplied to the function is not null / empty.
    if (!user) {
        // Get the language data.
        const languageData = getState("language").language.languageData;

        // Return with an error message for a toast event.
        return Toasty.notify({
                toastType: Toasty.error(),
                toastMessage: get(languageData, ["common", "auth", "noUser"])
            });
    }

    // Dispatch the result.
    dispatch({
        type: SET_USER,
        payload: {
            info: savedUser
        }
    });
}

/**
 * Logout User
 *
 * Logs out the user by using the LOGOUT_USER action type. This will
 * set the user.info object to null.
 */
const logoutUser = () => (dispatch, getState) => {
    // Get the language data.
    const languageData = getState("language").language.languageData;

    // The user just logged out, so let them know.
    Toasty.notify({
        type: Toasty.success(),
        content: get(languageData, ["common", "auth", "loggedOut"])
    });

    // Dispatch the result.
    dispatch({
        type: LOGOUT_USER
    });
}

// Export the actions.
export {
    setUser,
    logoutUser
}