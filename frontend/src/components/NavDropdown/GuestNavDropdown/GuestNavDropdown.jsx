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

/**
 * Guest Navbar Component
 *
 * Contains the display components and associated functions for the guest
 * dropdown for the main navbar.
 */
const GuestNavDropdown = () => (
    <DropdownMenu className="dropdown-menu-arrow" right>
        <DropdownItem className="noti-title" header tag="div">
            <h6 className="text-overflow m-0">Welcome!</h6>
        </DropdownItem>
        <DropdownItem to={ links.auth.login } tag={ Link }>
            <FontAwesomeIcon icon="key" />&nbsp;
            <span>Login</span>
        </DropdownItem>
        <DropdownItem to={ links.auth.register } tag={ Link }>
            <FontAwesomeIcon icon="user-plus" />&nbsp;
            <span>Register</span>
        </DropdownItem>
    </DropdownMenu>
);

// Export the Guest Navbar Component.
export default GuestNavDropdown;