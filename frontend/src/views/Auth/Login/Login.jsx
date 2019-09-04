// Dependencies
import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Container,
    Row,
    Col,
    Alert
} from "reactstrap";

// Config & Application Links
import { config, links } from "../../../config";

// History
import History from "../../../util/History";

// Toast
import Toasty from "../../../util/Toasty";

// Authentication Methods
import { AuthController } from "../../../util/Auth";

// Controllers
import LoginController from "./LoginController";

// API
import APIFetch from "../../../util/APIFetch";
import LoginAPI from "./LoginAPI";

/**
 * Login View
 *
 * Contains the view component and related functions for the Login page.
 *
 * @param {object} props Properties passed to the component from the parent.
 */
const Login = () => {
    // Setup initial state.
    const [formData, setFormData] = useState({});
    const [formAlert, setFormAlert] = useState({ type: null });

    // Setup the API Fetch utility for the Login View.
    const [{ fetchResults }] = APIFetch({
        BASEURL: config.fusionAuth.BASEURL,
        PATH_SEARCH: LoginAPI.fusionAuth.getLogin.PATH_SEARCH,
        PATH_METHOD: LoginAPI.fusionAuth.getLogin.PATH_METHOD
    });

    /**
     * Handle input changes
     *
     * Update the formData object to hold the newest value for an input
     * when the value is changed. This is done so we can have a single source
     * of truth for the inputs.
     *
     * @param {object} event Event object that executed the function.
     */
    const handleInputChange = ({ target }) => {
        // Update state with new value for the input.
        setFormData({
            ...formData,
            [target.name]: target.value
        });
    };

    /**
     * Display form message
     *
     * Display a message above the form by setting the formAlert to include the type
     * of message and the message itself.
     *
     * @param {string} type Type of message to be displayed (ex success, error).
     * @param {string} message Message to be displayed.
     */
    const setAlert = (type, message) => {
        // Update state with the form alert type and message.
        setFormAlert({ type, message });
    };

    /**
     * Handle login actions
     *
     * Used to efficiently handle responses from the login requests to either
     * redirect the user or to display a message to the user.
     *
     * @param {object} loginObj Login response object
     */
    const handleLoginAction = (loginObj, user = null) => {
        // Check if we are going to redirect the user or display a message.
        if (loginObj.redirect) {
            // If the redirect is to the homepage, then the user has been logged in, so
            // we must log the user in on the frontend.
            if (loginObj.redirect === links.home) {
                // Use the Auth Controller to set the frontend state to log in the user.
                const loginInfo = AuthController.login(user);

                // If the user was logged in, redirect to the homepage.
                if (loginInfo.toastType === Toasty.info()) {
                    // Display a message so the user knows they were logged in.
                    Toasty.notify({
                        type: loginInfo.toastType,
                        content: loginInfo.toastMessage
                    });

                    // Send the user to the homepage.
                    History.push(loginObj.redirect);
                } else {
                    // Set an alert message otherwise and return from the function.
                    setAlert(loginInfo.alertType, loginInfo.alertMessage);
                    return;
                }
            }

            // Redirect the user to the location in the response object.
            History.push(loginObj.redirect);
        } else {
            // Display an alert to the user with the type and message supplied.
            setAlert(loginObj.alertType, loginObj.alertMessage);
        }
    };

    /**
     * Handle form submit
     *
     * Perform requests to the FusionAuth and API Service upon form submittal. This
     * will verify the user login information, and set cookies using the API Service
     * if the user has provided valid credentials.
     *
     * @param {object} e Form object that executed the function.
     */
    const handleFormSubmit = async e => {
        // Pervent the form from redirecting the user.
        e.preventDefault();
        // Append the application ID to the form data (necessary to find the user).
        formData.applicationId = config.fusionAuth.APPLICATION_ID;

        // Use the fetchResults method from the API Fetch Utility.
        fetchResults(formData)
            .then(response => {
                // Determine what to do with the user based on the success response from the
                // FusionAuth service.
                LoginController.loginResponse(response.status)
                    .then(loginResponse => {
                        // Handle the response.
                        handleLoginResponse(response, loginResponse);
                    })
                    .catch(errorResponse =>
                        // There was some sort of error on login, so show the user.
                        handleLoginAction(errorResponse)
                    );
            })
            .catch(errorResponse => {
                // Determine what to do with the user based on the error response from
                // the FusionAuth service. response.status can be undefined, so we have to
                // handle that as well.
                const status = errorResponse ? errorResponse.status : 500;

                // Handle the response.
                LoginController.loginResponse(status)
                    .catch(error => handleLoginAction(error));
            });
    };

    /**
     * Handle the login response
     *
     * Handles the response object from the login API request. Either
     * tries to log the user in by setting cookies. If not possible,
     * then the right login action is performed.
     *
     * @param {object} response Response object from login API
     * @param {object} loginResponse Response data from login API analysis
     */
    const handleLoginResponse = (response, loginResponse) => {
        // Check if the response status from the FusionAuth call to /api/login
        // resulted in a 200 status, which means the access token and user data
        // were passed back in the response object.
        if (response.status === 200) {
            // Attempt to set the user cookies by utilizing the API Service and pass
            // the access token, refresh token, and user object.
            LoginController.setCookies(response.data.refreshToken, response.data.token)
                .then(loginResult => handleLoginAction(loginResult, response.data.user))
                .catch(error => handleLoginAction(error));
        } else {
            // Handle the result from the login response check.
            handleLoginAction(loginResponse);
        }
    }

    // Render the Login View.
    return (
        <Container className="mt-5">
            <Row className="mt-5 justify-content-center">
                <Col xl="6" md="12" className="mt-5 mx-auto">
                    <Card className="bg-primary-card">
                        <CardHeader>
                            Login
                        </CardHeader>
                        <CardBody>
                            { formAlert.type &&
                                <Alert color={ formAlert.type }>
                                    { formAlert.message }
                                </Alert>
                            }
                            <Form role="form" onSubmit={ handleFormSubmit }>
                                <Col xl="8" md="12" className="mb-3 mx-auto">
                                    <FormGroup>
                                        <InputGroup className="input-group-alternative">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <FontAwesomeIcon icon="envelope" />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input placeholder="Email / Username" type="text" name="loginId" onChange={ handleInputChange } value={ formData["loginId"] || "" } autoFocus />
                                        </InputGroup>
                                    </FormGroup>
                                </Col>
                                <Col xl="8" md="12" className="mb-3 mx-auto">
                                    <FormGroup>
                                        <InputGroup className="input-group-alternative">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <FontAwesomeIcon icon="lock" />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input placeholder="Password" type="password" name="password" onChange={ handleInputChange } value={ formData["password"] || "" } />
                                        </InputGroup>
                                    </FormGroup>
                                </Col>
                                <FormGroup className="text-center">
                                    <Button className="my-3 bg-primary" type="submit">
                                        Sign in
                                    </Button>
                                </FormGroup>
                            </Form>

                            <Row className="text-center">
                                <Col className="text-center">
                                    <a href="#pablo" title="Forgot Password?">
                                        <small>Forgot password?</small>
                                    </a>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

// Export the Login View.
export default Login;