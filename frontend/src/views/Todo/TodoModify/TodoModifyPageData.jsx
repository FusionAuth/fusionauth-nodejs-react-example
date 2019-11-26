// Dependencies
import React from "react";

// Components
import PageData from "../../../components/Util/PageData";

/**
 * ToDo Item Data Component
 *
 * Display the ToDo item of a given ID properly.
 *
 * @param {Boolean} isLoading Loading indication for API request.
 * @param {Object} results Result object from the API request.
 * @param {Object} hasError Error object from the API request.
 * @param {Function} component The component that needs to be diplayed, as a function.
 */
const TodoPageData = ({ isLoading, results, hasError, component }) => {
    // Display the ToDo item for the current user with the given ID if it exists.
    const todoInfo = component();

    // Return the formatted result, with error and loading indication.
    return <PageData
                isLoading={ isLoading }
                results={ results }
                hasError={ hasError }
                component={ todoInfo }
            />;
}

// Export the ToDo Item Data Component.
export default TodoPageData;