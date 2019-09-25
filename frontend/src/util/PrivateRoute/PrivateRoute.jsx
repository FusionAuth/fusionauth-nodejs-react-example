/**
 * Private Route Component
 *
 * This Private Route utilizes a connection to an API server to determine whether or not
 * a user is able to view a certain page. This works on a validated JWT as well as user
 * and application roles. Some may utilize local storage for this ability, however, this
 * route chooses a more stringent method to ensure users only access content they
 * should be able to access. This will add some load time to each page request due
 * to the network request. It's a trade off that you must consider.
 */

// Dependencies
import React, { useState, useEffect } from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";

// Components
import Authenticating from "../../components/Util/Authenticating";
import NotAuthorized from "../../components/Util/NotAuthorized";

// Redux Actions
import { logoutUser } from "../../redux/actions";

// Toast
import Toasty from "../../util/Toasty";

// Authentication Methods
import Auth from "../Auth";

/**
 * Private Route
 *
 * Checks whether or not the user is authenticated in order to access the private route.
 * If not, the user is redirected to the login page.
 *
 * @param {Object} component React component
 * @param {Function} logoutUser Redux action to unset the user.
 * @param {String} locale The current locale of the application.
 * @param {Object} languageData Current language information for the app. Language data object.
 */
const PrivateRoute = ({ component: Component, logoutUser, locale, languageData, ...rest }) => {
    // Setup initial state.
    const [canAccessPage, setCanAccessPage] = useState(null);

    // React hook
    useEffect(() => {
        // Set a variable so we can cancel the request if needed (ex, user
        // moves to a new page).
        let didCancel = false;

        /**
         * Determine if a user can access a page.
         *
         * Makes a call to the Auth Controller to see if a user can access the page
         * in question. It also makes sure that the user has not moved to a new page
         * before trying to update the state.
         */
        const determineAccess = () => {
            // Make sure we don't try to change state after re-render.
            if (!didCancel) {
                Auth.canAccessPage({ locale, logoutUser, ...rest })
                    .then(() => !didCancel && setCanAccessPage(true))
                    .catch(response => {
                        // Let the user know they cannot access the page.
                        Toasty.notify({
                            type: Toasty.error(),
                            content: response.message
                        });

                        // Make sure we don't try to change state after re-render.
                        if (!didCancel) {
                            // Set the access page variable so the application can redirect the user.
                            setCanAccessPage(false);
                        }
                    });
            }
        };

        // Call the page access method.
        determineAccess();

        /**
         * Perform action when the component is unmounted
         *
         * The return function in useEffect is equivalent to componentWillUnmount and
         * can be used to cancel the API request.
         */
        return () => {
            // Set the canceled variable to true.
            didCancel = true;
        };

        // eslint-disable-next-line
    }, [Component]);

    // Render the Private Route, or send the user to the homepage.
    return <Route
        { ...rest }
        render={ props =>
            canAccessPage !== null
            ? canAccessPage
                ? <Component { ...props } />
                : <NotAuthorized />
            : <Authenticating />
        }
    />
};

/**
 * Get App State
 *
 * Get the requried state for the component from the Redux store.
 *
 * @param {Object} state Application state from Redux.
 */
const mapStateToProps = state => {
    return {
        locale: state.language.locale,
        languageData: state.language.languageData
    }
}

// Export the Private Route Component.
export default connect(mapStateToProps, { logoutUser })(PrivateRoute);