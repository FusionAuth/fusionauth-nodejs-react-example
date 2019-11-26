// Views
import Home from "./views/Home";
import Login from "./views/Auth/Login";
import Register from "./views/Auth/Register";
import ForgotPassword from "./views/Auth/ForgotPassword";
import ChangePassword from "./views/Auth/ChangePassword";
import { VerifyEmail, Verify2Factor } from "./views/Auth/Verify";
import { UserChangePassword, User2Factor } from "./views/User";
import { UserProfileView, UserProfileEdit } from "./views/User/UserProfile";
import { TodoList, TodoModify, TodoView } from "./views/Todo";

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
        path: "/auth/forgotPassword/",
        name: "Forgot Password",
        component: ForgotPassword
    }, {
        path: "/auth/ChangePassword/",
        name: "Change Password",
        component: ChangePassword
    }, {
        path: "/auth/ChangePassword/:changePasswordId",
        name: "Change Password",
        component: ChangePassword
    }, {
        path: "/auth/verify/email/",
        name: "Verify Email",
        component: VerifyEmail
    }, {
        path: "/auth/verify/email/:verificationId",
        name: "Verify Email",
        component: VerifyEmail
    }, {
        path: "/auth/verify/2fa/",
        name: "2FA Login",
        component: Verify2Factor
    }, {
        path: "/",
        name: "Home",
        component: Home
    }, {
        private: true,
        path: "/user/profile/",
        name: "User Profile",
        component: UserProfileView
    }, {
        private: true,
        path: "/user/profile/edit/",
        name: "Edit User Profile",
        component: UserProfileEdit
    }, {
        private: true,
        path: "/user/changePassword/",
        name: "User Change Password",
        component: UserChangePassword
    }, {
        private: true,
        path: "/user/2fa/",
        name: "User 2FA",
        component: User2Factor
    }, {
        private: true,
        path: "/todo/",
        name: "Todo List",
        component: TodoList
    }, {
        private: true,
        path: "/todo/add/",
        name: "Add ToDo",
        component: TodoModify
    }, {
        private: true,
        path: "/todo/edit/:id",
        name: "Edit ToDo",
        component: TodoModify
    }, {
        private: true,
        path: "/todo/:id",
        name: "View ToDo",
        component: TodoView
    }
];

// Export the routes array.
export default routes;
