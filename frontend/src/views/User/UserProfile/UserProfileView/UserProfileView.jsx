// Dependencies
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { get } from "lodash";
import classNames from "classnames";
import {
    Card,
    CardHeader,
    CardBody,
    Container,
    Row,
    Col
} from "reactstrap";

// Config
import { config, links } from "../../../../config";

// API
import APIFetch from "../../../../util/APIFetch";
import UserProfileViewAPI from "./UserProfileViewAPI";

// Components
import CustomButton from "../../../../components/CustomButton";

// Page Data
import UserProfileViewPageData from "./UserProfileViewPageData";

/**
 * User Profile View
 *
 * Get the user's profile information from FusionAuth.
 *
 * @param {String} locale The current locale of the application.
 * @param {Object} languageData Current language information for the app. Language data object.
 */
const UserProfileView = ({ locale, languageData }) => {
    // Setup the API Fetch utility for the User Profile View.
    const [{ isLoading, results, hasError }] = APIFetch({
        locale,
        BASEURL: config.apiServer.BASEURL,
        PATH_SEARCH: UserProfileViewAPI.apiService.getProfile.PATH_SEARCH,
        PATH_METHOD: UserProfileViewAPI.apiService.getProfile.PATH_METHOD
    });

    // Create a dynamic class name for the panel that will center the text
    // if the result status is not 200.
    const isCenteredText = classNames({
        "mx-auto": isLoading || get(results, "status") !== 200
    });

    // Render the User Profile View.
    return (
        <Container className="mt-5">
            <Row className="mt-5 justify-content-center">
                <Col xl="6" md="12" className="mt-5 mx-auto">
                    <Card className="bg-primary-card">
                        <CardHeader className="d-flex align-items-center">
                            { get(languageData, ["common", "myProfile"]) }

                            <Link to={ links.user.editProfile } title={ get(languageData, ["common", "editProfile"]) } className="ml-auto">
                                <CustomButton color="warning" text={ get(languageData, ["common", "edit"]) } />
                            </Link>
                        </CardHeader>
                        <CardBody className={ isCenteredText }>
                            <Row>
                                <UserProfileViewPageData
                                    isLoading={ isLoading }
                                    results={ results }
                                    hasError={ hasError }
                                />
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

/**
 * Get App State
 *
 * Get the requried state for the component from the Redux store.
 *
 * @param {Object} state Application state from Redux.
 */
const mapStateToProps = state => {
    return {
        locale: state.language.locale,
        languageData: state.language.languageData
    }
}

// Export the User Profile View.
export default connect(mapStateToProps)(UserProfileView);
