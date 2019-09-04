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
 * Not Found View
 *
 * For all not found requests, display a 404 Not Found message.
 */
const NotFound = () => (
    <Container className="mt-5">
        <Row className="mt-5 justify-content-center">
            <Col xl="6" md="12" className="mt-5 mx-auto">
                <Card className="bg-primary-card">
                    <CardHeader>
                        404 - Not Found
                    </CardHeader>
                    <CardBody className="mx-auto">
                        The page that you were looking for could not be found. Is this an error on
                        our part, or yours?
                    </CardBody>
                </Card>
            </Col>
        </Row>
    </Container>
);

// Export the Not Found View.
export default NotFound;