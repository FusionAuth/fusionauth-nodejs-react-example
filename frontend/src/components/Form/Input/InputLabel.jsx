// Dependencies
import React from "react";
import { isEmpty } from "lodash";
import { Label } from "reactstrap";

/**
 * Custom Input Label
 *
 * Displays a custom input label for form inputs.
 *
 * @param {Object} props Properties from the parent function.
 */
const InputLabel = props => {
    return !isEmpty(props.htmlFor) && !isEmpty(props.label)
        ?   <Label htmlFor={ props.htmlFor } className={ props.className }>
                { props.labelMuted
                    ?   <span className="text-muted">
                            { props.label }
                        </span>
                    : props.label
                }
            </Label>
        : "";
}

// Export the Custom Input Label component.
export default InputLabel;
