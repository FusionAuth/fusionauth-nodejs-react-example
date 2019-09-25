// Dependencies
import React from "react";
import { get } from "lodash";
import { connect } from "react-redux";
import {
    Card,
    CardHeader,
    CardBody,
    Container,
    Row,
    Col
} from "reactstrap";

/**
 * Authenticating Component
 *
 * Display a message to the user, in their preferred language, that
 * they do not have access to the content.
 *
 * @param {Object} languageData Current language information for the app. Language data object.
 */
const NotAuthorized = ({ languageData }) => (
    <Container className="mt-5">
        <Row className="mt-5 justify-content-center">
            <Col xl="6" lg="12" className="mx-auto">
                <Card className="bg-primary-card">
                    <CardHeader>
                        { get(languageData, ["common", "notAuthorized", "title"]) }
                    </CardHeader>
                    <CardBody>
                        { get(languageData, ["common", "notAuthorized", "message"]) }
                    </CardBody>
                </Card>
            </Col>
        </Row>
    </Container>
);

/**
 * Get App State
 *
 * Get the requried state for the component from the Redux store.
 *
 * @param {Object} state Application state from Redux.
 */
const mapStateToProps = state => {
    return {
        languageData: state.language.languageData
    }
}

// Export the Loading Component.
export default connect(mapStateToProps)(NotAuthorized);
