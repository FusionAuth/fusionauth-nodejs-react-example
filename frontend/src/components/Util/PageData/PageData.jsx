// Dependencies
import React from "react";

// Components
import Loading from "../../../components/Util/Loading";

/**
 * Page Data Component
 *
 * Display page data for different pages with the ability to display a loading
 * icon during the loading phase, an error message, or the component intended to
 * be displayed.
 *
 * @param {boolean} isLoading Loading indication for API request.
 * @param {object} hasError Error object from the API request.
 * @param {object} component Component to be displayed.
 */
const PageData = ({ isLoading, hasError, component }) => {
    // Display errors or the loading message.
    const loadingOrErrors = hasError ? <>{ hasError.data.message }</> : <Loading />;

    // Return loading, errors, or the page component.
    return isLoading ? loadingOrErrors : component;
}

// Export the User Profile Page Data Component.
export default PageData;