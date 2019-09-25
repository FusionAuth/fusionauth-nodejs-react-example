// Dependencies
import React, { useEffect, useRef } from "react";
import { get, map } from "lodash";
import { connect } from "react-redux";
import {
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Media
} from "reactstrap";

// Toasty
import Toasty from "../../../util/Toasty";

// Language
import { setLanguage } from "../../../redux/actions";
import languages from "../../../data/language/languages.json";

/**
 * Language Dropdown Component
 *
 * Contains the display components and associated functions for the guest
 * dropdown for the main navbar.
 *
 * @param {Function} setLanguage Redux action to change the app's language.
 * @param {Object} languageData Current language information for the app. Language data object.
 */
const LanguageDropdown = ({ setLanguage, languageData }) => {
    // Setup an initial mount reference so we can send Toast notifications
    // on update of the languageData.
    const initialMount = useRef(true);

    /**
     * Listen for updates
     *
     * Send the user a notification that their language preference was saved.
     */
    useEffect(() => {
        /**
         * Notify Function
         *
         * Notify the user.
         */
        const doNotify = () => {
            // Make sure we don't send a notification if this is the inital render.
            if (initialMount.current) {
                initialMount.current = false;
            } else {
                // Display a toast notification that the language was empty.
                Toasty.notify({
                    type: Toasty.info(),
                    content: get(languageData, ["common", "changeLang", "saved"])
                });
            }
        };


        // Call the notificaiton function.
        doNotify();
    }, [languageData]);

    // Display the Language Dropdown.
    return (
        <UncontrolledDropdown nav>
            <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                    <span className="flag flag-sm">
                        <img
                            alt={ get(languageData, ["common", "langData", "name"]) }
                            src={ get(languageData, ["common", "langData", "flag"]) }
                        />
                    </span>
                    <Media className="ml-2">
                        <span className="mb-0 text-sm font-weight-bold">
                            { get(languageData, ["common", "langData", "name"]) }
                        </span>
                    </Media>
                </Media>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-arrow">
                {
                    map(languages, (lang, key) => (
                        <DropdownItem onClick={ setLanguage } data-lang={ get(lang, "shortcode") } key={ key }>
                            <span className="flag flag-sm">
                                <img
                                    alt={ get(lang, "name") }
                                    src={ get(lang, "flag") }
                                    data-lang={ get(lang, "shortcode") }
                                />
                            </span>
                            &nbsp;<span data-lang={ get(lang, "shortcode") }>{ get(lang, "name") }</span>
                        </DropdownItem>
                    ))
                }
            </DropdownMenu>
        </UncontrolledDropdown>
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
        languageData: state.language.languageData
    }
}

// Export the Language Dropdown Component.
export default connect(mapStateToProps, { setLanguage })(LanguageDropdown);