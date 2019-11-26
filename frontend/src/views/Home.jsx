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
 * Home View
 *
 * Display some information on the home page about the NodeJS + React + FusionAuth
 * example application.
 *
 * @param {Object} languageData Current language information for the app. Language data object.
 */
const Home = ({ languageData }) => (
    <Container className="mt-5">
        <Row className="mt-5 justify-content-center">
            <Col xl="6" md="12" className="mt-5 mx-auto">
                <Card className="bg-primary-card">
                    <CardHeader>
                        { get(languageData, ["common", "about"]) }
                    </CardHeader>
                    <CardBody className="mx-auto">
                        { get(languageData, ["common", "aboutDesc"]) }
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

// Export the Home View.
export default connect(mapStateToProps)(Home);
