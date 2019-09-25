// Dependencies
import React from "react";

// Components
import PageData from "../../../../components/Util/PageData";

/**
 * Verify Email Page Data Component
 *
 * Display the proper components for the user if the verification ID was
 * supplied to the page via the URL.
 *
 * @param {Boolean} isLoading Loading indication for API request.
 * @param {Object} hasError Error object from the API request.
 */
const VerifyEmailPageData = ({ isLoading, hasError }) => {
    // Return the formatted result, with error and loading indication.
    return <PageData
                isLoading={ isLoading }
                hasError={ hasError }
            />;
}

// Export the Verify Email Page Data Component.
export default VerifyEmailPageData;