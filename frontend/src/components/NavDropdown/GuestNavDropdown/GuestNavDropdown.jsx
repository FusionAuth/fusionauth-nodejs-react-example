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
import guestLinks from "./GuestLinks";

/**
 * Guest Navbar Component
 *
 * Contains the display components and associated functions for the guest
 * dropdown for the main navbar.
 *
 * @param {Object} languageData Current language information for the app. Language data object.
 */
const GuestNavDropdown = ({ languageData }) => (
    <DropdownMenu className="dropdown-menu-arrow">
        <DropdownItem className="noti-title" header tag="div">
            <h6 className="text-overflow m-0">{ get(languageData, ["common", "welcome"]) }</h6>
        </DropdownItem>
        {
            map(guestLinks, (link, key) => (
                <DropdownItem to={ get(links, link["link"]) || "#" } tag={ Link } key={ key } title={ get(languageData, link["text"]) }>
                    <FontAwesomeIcon icon={ link["icon"] } />&nbsp;
                    <span>{ get(languageData, link["text"]) }</span>
                </DropdownItem>
            ))
        }
    </DropdownMenu>
);

/**
 * Get App State
 *
 * Get the requried state for the component from the Redux store.
 *
 * @param {Object} state Application state from Redux.
 */
const mapStateToProps = state => {
    return {
        languageData: state.language.languageData
    }
}

// Export the Guest Navbar Component.
export default connect(mapStateToProps)(GuestNavDropdown);