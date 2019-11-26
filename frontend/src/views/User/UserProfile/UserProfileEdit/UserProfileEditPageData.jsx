// Dependencies
import React from "react";

// Components
import PageData from "../../../../components/Util/PageData";

/**
 * User Profile Edit Page Data Component
 *
 * Display the user's information for their profile to be able to edit it.
 *
 * @param {Boolean} isLoading Loading indication for API request.
 * @param {Object} results Result object from the API request.
 * @param {Object} hasError Error object from the API request.
 * @param {Function} component The component that needs to be diplayed, as a function.
 */
const UserProfileEditPageData = ({ isLoading, results, hasError, component }) => {
    // Display the user's profile information from the function provided.
    const profileInfo = component();

    // Return the formatted result, with error and loading indication.
    return <PageData
                isLoading={ isLoading }
                results={ results }
                hasError={ hasError }
                component={ profileInfo }
            />;
}

// Export the ToDo Item Data Component.
export default UserProfileEditPageData;