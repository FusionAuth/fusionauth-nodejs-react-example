// Dependencies
import React from "react";
import { Col } from "reactstrap";

// Components
import PageData from "../../../components/Util/PageData";

/**
 * Profile Page Data Component
 *
 * Display the user's profile data properly.
 *
 * @param {array} fields Array of fields we want to extract from the result object.
 * @param {boolean} isLoading Loading indication for API request.
 * @param {object} results Result object from the API request.
 * @param {object} hasError Error object from the API request.
 */
const ProfilePageData = ({ fields, isLoading, results, hasError }) => {
    // Display user information if the results object is set.
    // Loop through and find information in the result object from the fields array.
    const userInfo = results && fields.map((field, i) => (
        <Col xl="6" md="12" className="mb-3 mx-auto" key={ i }>
            <b>{ field.text }</b><br />
            { results.data.message[field.fieldName] || "Not Set" }
        </Col>
    ));

    // Return the formatted result, with error and loading indication.
    return <PageData
        isLoading={ isLoading }
        results={ results }
        hasError={ hasError }
        component={ userInfo } />;
}

// Export the User Profile Page Data Component.
export default ProfilePageData;