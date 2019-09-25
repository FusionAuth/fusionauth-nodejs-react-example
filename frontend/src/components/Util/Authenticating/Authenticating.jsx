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
 * Display a message to the user, in their preferred language, that they
 * are being authenticated to access the information.
 *
 * @param {Object} languageData Current language information for the app. Language data object.
 */
const Authenticating = ({ languageData }) => (
    <Container className="mt-5">
        <Row className="mt-5 justify-content-center">
            <Col xl="6" lg="12" className="mx-auto">
                <Card className="bg-primary-card">
                    <CardHeader>
                        { get(languageData, ["common", "security"]) }
                    </CardHeader>
                    <CardBody className="mx-auto">
                        { get(languageData, ["common", "authenticating"]) }...
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
export default connect(mapStateToProps)(Authenticating);