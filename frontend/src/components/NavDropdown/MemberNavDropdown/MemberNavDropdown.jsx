// Dependencies
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    DropdownMenu,
    DropdownItem
} from "reactstrap";

// Application Links
import { links } from "../../../config";

// History
import History from "../../../util/History";

// Toast
import Toasty from "../../../util/Toasty";

// Authentication Methods
import { AuthController } from "../../../util/Auth";

// Controllers
import { LogoutController } from "../../../views/Auth/Logout";

/**
 * Member Navbar Component
 *
 * Contains the display components and associated functions for the member
 * dropdown for the main navbar.
 *
 * @param {object} props Properties passed to the component from the parent (useful for accessing history)
 */
const MemberNavDropdown = () => {
    /**
     * Handle logout
     *
     * Will handle the logout request for when the button is clicked.
     *
     * @param {object} e Event object
     */
    const logout = e => {
        // Prevent the link from executing.
        e.preventDefault();
        // Use the LogoutController to handle the logout.
        LogoutController.logout()
            .then(() => {
                // Call the logout function and store the result.
                const logoutInfo = AuthController.logout();

                // Display the information message (or error) about the
                // logout action performed.
                Toasty.notify({
                    type: logoutInfo.toastType,
                    content: logoutInfo.toastMessage
                });

                // If the logout was successful, then redirect the user to the homepage.
                if (logoutInfo.toastType === Toasty.info()) {
                    History.push(links.home);
                }
            }).catch(error =>
                // Display the error from the API server on logout.
                Toasty.notify({
                    type: Toasty.error(),
                    content: error
                })
            );
    }

    // Display the Member Nav Dropdown.
    return (
        <DropdownMenu className="dropdown-menu-arrow" right>
            <DropdownItem className="noti-title" header tag="div">
                <h6 className="text-overflow m-0">Welcome!</h6>
            </DropdownItem>
            <DropdownItem to={ links.todo.list } tag={ Link }>
                <FontAwesomeIcon icon="clipboard-list" />&nbsp;
                <span>Todo List</span>
            </DropdownItem>
            <DropdownItem to={ links.user.profile } tag={ Link }>
                <FontAwesomeIcon icon="user-tie" />&nbsp;
                <span>Profile</span>
            </DropdownItem>
            <DropdownItem to="#" tag={ Link } onClick={ logout }>
                <FontAwesomeIcon icon="power-off" />&nbsp;
                <span>Logout</span>
            </DropdownItem>
        </DropdownMenu>
    );
};

// Export the Member Navbar Component.
export default MemberNavDropdown;