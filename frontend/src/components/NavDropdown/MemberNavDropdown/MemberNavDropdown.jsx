// Dependencies
import React from "react";
import { Link } from "react-router-dom";
import { get, map } from "lodash";
import { connect } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    DropdownMenu,
    DropdownItem
} from "reactstrap";

// Application Links
import { links } from "../../../config";
import memberLinks from "./MemberLinks.json"

// Redux Actions
import { logoutUser } from "../../../redux/actions";

// Toast
import Toasty from "../../../util/Toasty";

// History
import History from "../../../util/History";

// Controllers
import LogoutController from "../../../util/Logout";

/**
 * Member Navbar Component
 *
 * Contains the display components and associated functions for the member
 * dropdown for the main navbar.
 *
 * @param {Function} logoutUser Redux action to unset the user.
 * @param {String} locale The current locale of the application.
 * @param {Object} languageData Current language information for the app. Language data object.
 */
const MemberNavDropdown = ({ logoutUser, locale, languageData }) => {
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
        LogoutController.logout(locale, languageData)
            .then(() => {
                // Call the logout function.
                logoutUser();

                // Redirect the user to the home page.
                History.push(links.home);
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
        <DropdownMenu className="dropdown-menu-arrow">
            <DropdownItem className="noti-title" header tag="div">
                <h6 className="text-overflow m-0">{ get(languageData, ["common", "welcome"]) }</h6>
            </DropdownItem>
            {
                map(memberLinks, (link, key) => (
                    <DropdownItem to={ get(links, link["link"]) || "#" } tag={ Link } key={ key } title={ get(languageData, link["text"]) } onClick={ get(link, "logout") && logout }>
                        <FontAwesomeIcon icon={ link["icon"] } />&nbsp;
                        <span>{ get(languageData, link["text"]) }</span>
                    </DropdownItem>
                ))
            }
        </DropdownMenu>
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
        languageData: state.language.languageData
    }
}

// Export the Member Navbar Component.
export default connect(mapStateToProps, { logoutUser })(MemberNavDropdown);