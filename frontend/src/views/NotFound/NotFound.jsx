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
 * Not Found View
 *
 * For all not found requests, display a 404 Not Found message.
 *
 * @param {Object} languageData Current language information for the app. Language data object.
 */
const NotFound = ({ languageData }) => (
    <Container className="mt-5">
        <Row className="mt-5 justify-content-center">
            <Col xl="6" md="12" className="mt-5 mx-auto">
                <Card className="bg-primary-card">
                    <CardHeader>
                        { get(languageData, ["common", "404", "title"]) }
                    </CardHeader>
                    <CardBody className="mx-auto">
                        { get(languageData, ["common", "404", "message"]) }
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

// Export the Not Found View.
export default connect(mapStateToProps)(NotFound);