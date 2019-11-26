// Dependencies
import React from "react";
import { connect } from "react-redux";
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

// Components
import PageData from "../../../components/Util/PageData";

// Views
import Enable from "./Enable";
import Disable from "./Disable";

// Config
import { config } from "../../../config";

// API
import APIFetch from "../../../util/APIFetch";
import User2FactorAPI from "./User2FactorAPI";

/**
 * User 2Factor Settings View
 *
 * A container view for the Enable/Disable 2Factor pages for logged in users.
 *
 * @param {String} locale The current locale of the application.
 * @param {Object} languageData Current language information for the app. Language data object.
 */
const User2Factor = ({ locale, languageData }) => {
    // Setup the API Fetch utility for the User 2Factor Settings View.
    const [{ isLoading, results, hasError }] = APIFetch({
        locale,
        BASEURL: config.apiServer.BASEURL,
        PATH_SEARCH: User2FactorAPI.apiService.get2FA.PATH_SEARCH,
        PATH_METHOD: User2FactorAPI.apiService.get2FA.PATH_METHOD
    });

    // Create a dynamic class name for the panel that will center the text
    // if the result status is not 200.
    const isCenteredText = classNames({
        "mx-auto": isLoading || get(results, "status") !== 200
    });

    // Render the User 2Factor Settings View.
    return (
        <Container className="mt-5">
            <Row className="mt-5 justify-content-center">
                <Col xl="6" md="12" className="mt-5 mx-auto">
                    <Card className="bg-primary-card">
                        <CardHeader className="d-flex align-items-center">
                            { get(results, ["data", "twoFA"]) === true
                                ? get(languageData, ["common", "twoFactorDisable"])
                                : get(languageData, ["common", "twoFactorEnable"])
                            }
                        </CardHeader>
                        <CardBody className={ isCenteredText }>
                            <Row>
                                { get(results, ["data"])
                                    ? get(results, ["data", "twoFA"]) === true
                                        ?   <Disable />
                                        :   <Enable
                                                content={ results.data.content }
                                            />
                                    :   <PageData
                                            isLoading={ isLoading }
                                            hasError={ hasError }
                                        />
                                }
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

// Export the User 2Factor Settings View.
export default connect(mapStateToProps)(User2Factor);
