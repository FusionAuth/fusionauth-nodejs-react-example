// Views
import Home from "./views/Home";
import { Login } from "./views/Auth/Login";
import { Register } from "./views/Auth/Register";
import { UserProfile } from "./views/User/Profile";
import { Todo } from "./views/Todo";

/**
 * Routes Array
 *
 * The routes array contains information about all of the available routes
 * in the application and is used to determine what text to display as well
 * as whether or not the route requires authentication to view.
 */
const routes = [
    {
        path: "/auth/login/",
        name: "Login",
        component: Login
    }, {
        path: "/auth/register/",
        name: "Register",
        component: Register
    }, {
        path: "/",
        name: "Home",
        component: Home
    }, {
        private: true,
        path: "/user/profile/",
        name: "User Profile",
        component: UserProfile
    }, {
        private: true,
        path: "/todo/",
        name: "Todo List",
        component: Todo
    }
];

// Export the routes array.
export default routes;
