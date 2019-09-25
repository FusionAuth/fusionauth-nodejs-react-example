// Dependencies
import React, { useState, useEffect } from "react";
import { isEmpty } from "lodash";
import { FormFeedback} from "reactstrap";

/**
 * Input Error Component
 *
 * Custom error display for inputs that converts the array of errors into
 * a single set of list items.
 *
 * @param {Array} errors Array of errors for the input item.
 */
const InputError = ({ errors }) => {
    // Set and get input errors with React Hook.
    const [inputErrors, setInputErrors] = useState([]);

    // Use `useEffect` to set and update the errors as they change.
    useEffect(() => {
        /**
         * Update the errors for the input item.
         */
        const updateErrors = () => {
            // If the error array is empty, set the error state to an empty string.
            if (isEmpty(errors)) {
                setInputErrors("");
            } else {
                // Set an empty array for the error state.
                let listErrors = [];

                // Loop through each error in the passed array and push an `li` item to the error state.
                errors.forEach((e, key) => listErrors.push(<li key={ key }>{ e }</li>));

                // Set the error state.
                setInputErrors(listErrors);
            }
        }

        // Call the error update function.
        updateErrors();
    }, [errors]);

    // Display the error(s).
    return <FormFeedback invalid="true">{ inputErrors }</FormFeedback>;
}

// Export the Custom Input Error component.
export default InputError;
