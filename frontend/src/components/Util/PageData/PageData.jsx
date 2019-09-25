// Dependencies
import React from "react";
import { get } from "lodash";

// Components
import Loading from "../../../components/Util/Loading";

/**
 * Page Data Component
 *
 * Display page data for different pages with the ability to display a loading
 * icon during the loading phase, an error message, or the component intended to
 * be displayed.
 *
 * @param {Object} results Page results
 * @param {Boolean} isLoading Loading indication for API request.
 * @param {Object} hasError Error object from the API request.
 * @param {Object} component Component to be displayed.
 */
const PageData = ({ results, isLoading, hasError, component }) => {
    // Display errors or the loading message.
    const loadingOrErrors = hasError ? <>{ hasError.data.message }</> : <Loading />;

    // Check if the results are anything but 200 to display their error message.
    const isResults200 = get(results, "status") === 200 ? component : <>{ get(results, "data") && results.data.message }</>;

    // Return loading, errors, or the page component.
    return isLoading ? loadingOrErrors : isResults200;
}

// Export the User Profile Page Data Component.
export default PageData;