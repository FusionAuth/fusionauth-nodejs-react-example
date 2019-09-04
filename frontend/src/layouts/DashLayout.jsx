// Dependencies
import React from "react";
import { Route, Switch } from "react-router-dom";

// Components
import Navbar from "../components/Navbar";

// Routes
import routes from "../routes";
import PrivateRoute from "../util/PrivateRoute";
import NotFound from "../views/NotFound";

// Authentication Methods
import { AuthController } from "../util/Auth";

/**
 * Display Routes
 *
 * The routes available to the application are passed to the function to determine
 * how to include them into the application. Private routes are protected with
 * the PrivateRoute component while other routes do not need protection.
 *
 * @param {array} routes Array of application routes.
 * @param {object} user User information for logged in user.
 */
const getRoutes = (routes, user) => {
  // Return all of the routes after looping through each route.
  return routes.map((prop, key) => {
    // If the route is private, then use the PrivateRoute component.
    if (prop.private) {
      // Due to the way the routes are setup, we have to set exact to
      // true to handle non-existent pages.
      return (
        <PrivateRoute
          exact={ true }
          path={ prop.path }
          component={ prop.component }
          user={ user }
          key={ key }
        />
      );
    } else {
      // Return a normal route if the route is not private. Due to the way the
      // routes are setup, we have to set exact to true to handle non-existent pages.
      return (
        <Route
          exact={ true }
          path={ prop.path }
          render={ props => <prop.component { ...props } user={ user } />}
          key={ key }
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
 * @param {object} props Properties passed to the component from the parent
 */
const DashLayout = props => {
  // Logged in status and information. Passed as a prop to all components that could
  // possibly need the information for display purposes.
  const user = AuthController.user();

  return (
    <div className="main-content">
      <Navbar
        { ...props }
        routes={ routes }
        user={ user }
      />
      <Switch>
        { getRoutes(routes, user) }
        { /* Any page that cannot be routed will utilize the NotFound component. */ }
        <Route component={ NotFound } />
      </Switch>
    </div>
  );
};

// Export the Dashboard Layout Component.
export default DashLayout;
