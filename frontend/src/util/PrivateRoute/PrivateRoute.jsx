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
import { Route, Redirect } from "react-router-dom";

// Components
import Authenticating from "../../components/Util/Authenticating";

// Application Links
import { links } from "../../config";

// Toast
import Toasty from "../../util/Toasty";

// Authentication Methods
import { AuthController } from "../Auth";

/**
 * Private Route
 *
 * Checks whether or not the user is authenticated in order to access the private route.
 * If not, the user is redirected to the login page.
 *
 * @param {object} component React component
 */
const PrivateRoute = ({ component: Component, user, ...rest }) => {
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
            AuthController.canAccessPage(rest)
                .then(() => !didCancel && setCanAccessPage(true))
                .catch(message => {
                    if (!didCancel) {
                        // Let the user know they cannot access the page.
                        Toasty.notify({
                            type: Toasty.error(),
                            content: message
                        });

                        // Set the access page variable so the application can redirect the user.
                        setCanAccessPage(false);
                    }
                });
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
                : <Redirect
                    to={ {
                        pathname: links.home,
                        state: { from: props.location },
                    } }
                />
            : <Authenticating />
        }
    />
};

// Export the Private Route Component.
export default PrivateRoute;