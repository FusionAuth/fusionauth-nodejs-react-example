// Dependencies
import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { get, map } from "lodash";

// Components
import Navbar from "../components/Navbar";

// Routes
import routes from "../routes";
import PrivateRoute from "../util/PrivateRoute";
import NotFound from "../views/NotFound";

// Logout Controller
import LogoutController from "../util/Logout";

// Links
import { links } from "../config";

// Redux Actions
import { logoutUser } from "../redux/actions";

// History
import History from "../util/History";

// Toasty
import Toasty from "../util/Toasty";

/**
 * Display Routes
 *
 * The routes available to the application are passed to the function to determine
 * how to include them into the application. Private routes are protected with
 * the PrivateRoute component while other routes do not need protection.
 *
 * @param {array} routes Array of application routes.
 */
const getRoutes = (routes) => {
  // Return all of the routes after looping through each route.
  return map(routes, (prop, key) => {
    // If the route is private, then use the PrivateRoute component.
    if (prop.private) {
      // Due to the way the routes are setup, we have to set exact to
      // true to handle non-existent pages.
      return (
        <PrivateRoute
          key={ key }
          exact={ true }
          path={ prop.path }
          component={ prop.component }
        />
      );
    } else {
      // Return a normal route if the route is not private. Due to the way the
      // routes are setup, we have to set exact to true to handle non-existent pages.
      return (
        <Route
          key={ key }
          exact={ true }
          path={ prop.path }
          component={ prop.component }
        />
      );
    }
  });
};

/**
 * Dashboard Layout Component
 *
 * The overall layout component for most pages in the application.
 *
 * @param {Object} location Information about the view's location.
 * @param {Object} user The user's basic account information.
 * @param {Function} logoutUser Redux action to unset the user.
 * @param {String} locale The current locale of the application.
 * @param {Object} languageData Current language information for the app. Language data object.
 * @param {object} props Properties passed to the component from the parent
 */
const DashLayout = ({ location, user, logoutUser, locale, languageData, ...props}) => {
  // Setup an initial mount reference so we can send Toast notifications
  // on update of the languageData.
  const initialMount = useRef(true);

  /**
   * Listen for updates
   *
   * Listen for updates to the user object in storage. When it updates to a
   * non-null value, this means the user should be logged in. Let the user know
   * with a toast notification, and re-direct them.
   */
  useEffect(() => {
    /**
     * Perform actions for user login.
     */
    const doNotify = () => {
      // Make sure we don't send a notification if this is the inital render.
      if (initialMount.current) {
        initialMount.current = false;
      } else {
        // Make sure the user is not coming from the Edit Profile view.
        if (location.pathname !== links.user.editProfile) {
          // Check if the user exists.
          if (user) {
            // The user just logged in, so let them know.
            const content = get(languageData, ["common", "auth", "loggedIn"]);

            // Display a toast notification that the language was empty.
            Toasty.notify({
              type: Toasty.success(),
              content
            });

            // Redirect the user to the home page.
            History.push(links.home);
          }
        }
      }
    };

    // Call the notificaiton function.
    doNotify();

    // eslint-disable-next-line
  }, [user]);

  /**
   * Listen for updates
   *
   * Make sure the user exists in local storage, otherwise, force the user to login again.
   * This does not handle the real time with having local storage cleared, but as soon as
   * redux updates the store on page refresh using persistence, this will trigger.
   */
  useEffect(() => {
    /**
     * Check that the user exists
     */
    const ensureUserExists = () => {
      if (!user) {
        // Force the user to have their credentials removed from the server.
        LogoutController.logout(locale, languageData)
        .catch(error =>
          // Display the error from the API server on logout.
          Toasty.notify({
              type: Toasty.error(),
              content: error
          })
        );
      }
    };

    // Call the exist check function.
    ensureUserExists();
  });

  // Render the Dash Layout and the current page.
  return (
    <div className="main-content">
      <Navbar
        { ...props }
        routes={ routes }
        user={ user }
      />
      <Switch>
        { getRoutes(routes) }
        { /* Any page that cannot be routed will utilize the NotFound component. */ }
        <Route component={ NotFound } />
      </Switch>
    </div>
  );
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
        languageData: state.language.languageData,
        user: state.user.info
    }
}

// Export the Dashboard Layout Component.
export default connect(mapStateToProps, { logoutUser })(DashLayout);
