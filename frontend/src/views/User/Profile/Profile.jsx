// Dependencies
import React, { useState } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Container,
    Row,
    Col
} from "reactstrap";

// Config
import { config } from "../../../config";

// API
import APIFetch from "../../../util/APIFetch";
import ProfileAPI from "./ProfileAPI";

// Components
import CustomButton from "../../../components/CustomButton";

// Page Data
import ProfilePageData from "./ProfilePageData";


/**
 * User Profile View
 *
 * An example API call to the API Service is made here to show how to utilize
 * the JWT to make requests to the service. Most of the associated code is
 * within the NodeJS server. Making a call to the API Service is fairly simple.
 */
const UserProfile = () => {
    const [isViewing, setIsViewing] = useState(true);
    // Setup the API Fetch utility for the User Profile View.
    const [{ isLoading, results, hasError }] = APIFetch({
        BASEURL: config.apiServer.BASEURL,
        PATH_SEARCH: ProfileAPI.apiService.getProfile.PATH_SEARCH,
        PATH_METHOD: ProfileAPI.apiService.getProfile.PATH_METHOD
    });

    // Fields from the user object that we care about. The rest are not
    // wanted or needed to be seen.
    const fields = [
        { fieldName: "firstName", text: "First Name" },
        { fieldName: "lastName", text: "Last Name"},
        { fieldName: "email", text: "Email" },
        { fieldName: "username", text: "Username" }
    ];

    const editProfile = e => {
        e.preventDefault();
        setIsViewing(!isViewing);
    }

    const saveProfile = e => {
        e.preventDefault();
        setIsViewing(!isViewing);
    }

    // Render the Profile View.
    return (
        <Container className="mt-5">
            <Row className="mt-5 justify-content-center">
                <Col xl="6" md="12" className="mt-5 mx-auto">
                    <Card className="bg-primary-card">
                        <CardHeader className="d-flex align-items-center">
                            My Profile

                            <span className="ml-auto">
                                { isViewing
                                    ? <CustomButton color="info" text="Edit" onClick={ editProfile } />
                                    : <CustomButton color="success" text="Save" onClick={ saveProfile } />
                                }
                            </span>
                        </CardHeader>
                        <CardBody className="mx-auto">
                            <Row>
                                { isViewing
                                    ? <ProfilePageData
                                        fields={ fields }
                                        isLoading={ isLoading }
                                        results={ results }
                                        hasError={ hasError } />
                                    : <></>
                                }
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

// Export the User Profile View.
export default UserProfile;
