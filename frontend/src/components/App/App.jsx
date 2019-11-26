// Dependencies
import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
    faTimes,
    faKey,
    faPowerOff,
    faUser,
    faUserSecret,
    faUserNinja,
    faUserTie,
    faUserPlus,
    faEnvelope,
    faUserLock,
    faUserShield,
    faLock,
    faSync,
    faPhone,
    faClipboardList,
    faCheck,
    faTasks,
    faFeatherAlt,
    faCode,
    faShieldAlt
} from "@fortawesome/free-solid-svg-icons";

// Styling
import "react-toastify/dist/ReactToastify.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/css/custom.css";

// History
import History from "../../util/History";

// Layouts
import DashLayout from "../../layouts/DashLayout";

// Redux
import { store, persistor } from "../../redux/store";

// Font Awesome Initialization
library.add(
    faTimes,
    faKey,
    faPowerOff,
    faUser,
    faUserSecret,
    faUserNinja,
    faUserTie,
    faUserPlus,
    faEnvelope,
    faUserLock,
    faUserShield,
    faLock,
    faSync,
    faPhone,
    faClipboardList,
    faCheck,
    faTasks,
    faFeatherAlt,
    faCode,
    faShieldAlt
);

/**
 * Application Component
 *
 * This is where we declare the application. We use BrowserRouter to encapsulate
 * the application for routing purposes, and then we use Switch to be able to
 * handle the different routes.
 */
const App = () => {
    return (
        <Provider store={ store }>
            <PersistGate loading={ null } persistor={ persistor } >
                <Router history={ History }>
                    <ToastContainer />
                    <Switch>
                        <Route path="/" render={ props => <DashLayout { ...props } /> } />
                    </Switch>
                </Router>
            </PersistGate>
        </Provider>
    );
};

// Export the Application Component.
export default App;