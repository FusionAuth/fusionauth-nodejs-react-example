// Dependencies
import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { library } from "@fortawesome/fontawesome-svg-core";
import {
    faTimes,
    faKey,
    faPowerOff,
    faUserTie,
    faUserPlus,
    faEnvelope,
    faLock,
    faSync,
    faClipboardList
} from "@fortawesome/free-solid-svg-icons";

// Styling
import "react-toastify/dist/ReactToastify.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/css/custom.css";

// History
import History from "../../util/History";

// Layouts
import DashLayout from "../../layouts/DashLayout";

// Font Awesome Initialization
library.add(
    faTimes,
    faKey,
    faPowerOff,
    faUserTie,
    faUserPlus,
    faEnvelope,
    faLock,
    faSync,
    faClipboardList
);

/**
 * Application Component
 *
 * This is where we declare the application. We use BrowserRouter to encapsulate
 * the application for routing purposes, and then we use Switch to be able to
 * handle the different routes.
 */
const App = () => (
    <Router history={ History }>
        <ToastContainer />
        <Switch>
            <Route path="/" render={ props => <DashLayout { ...props } /> } />
        </Switch>
    </Router>
);

// Export the Application Component.
export default App;