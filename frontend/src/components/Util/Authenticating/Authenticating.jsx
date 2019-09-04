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
 * Authenticating Component
 *
 * A simple Font Awesome spinning icon to indicate to the user that
 * content is loading for them.
 */
const Authenticating = () => (
    <Container className="mt-5">
        <Row className="mt-5 justify-content-center">
            <Col xl="6" lg="12" className="mx-auto">
                <Card className="bg-primary-card">
                    <CardHeader>
                        Security
                    </CardHeader>
                    <CardBody className="mx-auto">
                        Authenticating...
                    </CardBody>
                </Card>
            </Col>
        </Row>
    </Container>
);

// Export the Loading Component.
export default Authenticating;
