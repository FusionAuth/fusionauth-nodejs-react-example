// Dependencies
import React from "react";
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
 */
const Home = () => (
    <Container className="mt-5">
        <Row className="mt-5 justify-content-center">
            <Col xl="6" md="12" className="mt-5 mx-auto">
                <Card className="bg-primary-card">
                    <CardHeader>
                        About
                    </CardHeader>
                    <CardBody className="mx-auto">
                        This application showcases how to use a NodeJS server for the backend API, ReactJS for the frontend component, and FusionAuth
                        for the authentication server. The ToDo application shows how to use roles for restricting access, and integration of MongoDB
                        for data persistence. Access tokens are automatically renewed within this application, but that feature can be disabled if needed.
                    </CardBody>
                </Card>
            </Col>
        </Row>
    </Container>
);

// Export the Home View.
export default Home;
