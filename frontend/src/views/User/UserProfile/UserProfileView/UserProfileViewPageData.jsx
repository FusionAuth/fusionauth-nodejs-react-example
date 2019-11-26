// Dependencies
import React from "react";
import { Col } from "reactstrap";
import { map } from "lodash";

// Components
import PageData from "../../../../components/Util/PageData";

/**
 * User Profile View Page Data Component
 *
 * Display the user's profile data properly.
 *
 * @param {boolean} isLoading Loading indication for API request.
 * @param {object} results Result object from the API request.
 * @param {object} hasError Error object from the API request.
 */
const UserProfileViewPageData = ({  isLoading, results, hasError }) => {
    // Fields from the user object that we care about. The rest are not
    // wanted or needed to be seen.
    const fieldNames = [
        { fieldName: "firstName", text: "First Name" },
        { fieldName: "lastName", text: "Last Name"},
        { fieldName: "email", text: "Email" },
        { fieldName: "username", text: "Username" },
        { fieldName: "twoFactorEnabled", text: "2FA Enabled" },
        { fieldName: "mobilePhone", text: "Phone" }
    ];

    // Display user information if the results object is set.
    // Loop through and find information in the result object from the fields array.
    const userInfo = results && map(fieldNames, (field, key) => {
        // Get the correct value.
        const value = results.data.content[field.fieldName] === true ? "true" : results.data.content[field.fieldName];

        // Return the formatted component.
        return (
            <Col xl="6" md="12" className="mb-3 mx-auto" key={ key }>
                <b>{ field.text }</b><br />
                { value || "Not Set" }
            </Col>
        );
    });

    // Return the formatted result, with error and loading indication.
    return <PageData
                isLoading={ isLoading }
                results={ results }
                hasError={ hasError }
                component={ userInfo }
            />;
}

// Export the User Profile View Page Data Component.
export default UserProfileViewPageData;