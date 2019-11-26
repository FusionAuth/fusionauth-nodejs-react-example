// Dependencies
import React from "react";
import { isEmpty } from "lodash";
import { InputGroupAddon, InputGroupText } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * Custom Input Addon
 *
 * Displays a custom input addon for form inputs. Can be used for prepend or append
 * addons.
 *
 * @param {Object} type Type of addon (prepend || append).
 * @param {Object} icon Icon to be displayed.
 */
const InputAddon = ({ type, icon }) => {
    return !isEmpty(type) && !isEmpty(icon)
        ?   <InputGroupAddon addonType={ type }>
                <InputGroupText>
                    <FontAwesomeIcon icon={ icon } />
                </InputGroupText>
            </InputGroupAddon>
        : "";
}

// Export the Custom Input Addon component.
export default InputAddon;
