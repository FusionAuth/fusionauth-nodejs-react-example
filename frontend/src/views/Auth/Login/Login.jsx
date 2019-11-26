// Dependencies
import React, { useState } from "react";
import { get, map } from "lodash";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Container,
    Row,
    Col,
    Alert
} from "reactstrap";

// Components
import CustomButton from "../../../components/CustomButton";

// Form
import Input from "../../../components/Form/Input";
import LoginForm from "./LoginForm.json";

// Config
import { config, links } from "../../../config";

// Redux Actions
import { setUser } from "../../../redux/actions";

// Controllers
import LoginController from "./LoginController";

// API
import APIFetch from "../../../util/APIFetch";
import LoginAPI from "./LoginAPI";

/**
 * Login View
 *
 * Contains the view component and related functions for the Login view.
 *
 * @param {Function} setUser Redux action to set the user.
 * @param {String} locale The current locale of the application.
 * @param {Object} languageData Current language information for the app. Language data object.
 */
const Login = ({ setUser, locale, languageData }) => {
    // Setup initial state.
    const [formData, setFormData] = useState({});
    const [formAlert, setFormAlert] = useState({ type: null });

    // Setup the API Fetch utility for the Login View.
    const [{ fetchResults }] = APIFetch({
        locale,
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
     * Handle login actions
     *
     * Used to efficiently handle responses from the login requests to either
     * redirect the user or to display a message to the user.
     *
     * @param {Object} responseObj Response object from the request.
     * @param {Object} data Data object required for handling the action.
     */
    const handleResponseAction = (responseObj, data) => {
        // Handle login actions with the login controller.
        const response = LoginController.handleAction(responseObj, data, setUser);

        // Check if there is a response to be handled.
        if (response) {
            // Set the form alert information.
            setFormAlert(response);
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

        try {
            // Use the fetchResults method from the API Fetch Utility.
            const response = await fetchResults(formData);
            // Determine what to do with the user based on the success response from the FusionAuth service.
            const loginResponse = await LoginController.handleResponse(response, languageData);
            // Handle the response.
            handleLoginResponse(response, loginResponse);
        } catch (error) {
            if (error.type) {
                // There was some sort of error on login, so show the user.
                handleResponseAction(error);
            } else {
                // Determine what to do with the user based on the error response from
                // the FusionAuth service. error.status can be undefined, so we have to
                // handle that as well.
                const status = error ? error.status : 500;

                // Handle the response.
                LoginController.handleResponse({ status }, languageData)
                    .catch(error => handleResponseAction(error));
            }
        }
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
    const handleLoginResponse = async (response, loginResponse) => {
        // Check if the response status from the FusionAuth call to /api/login
        // resulted in a 200 status, which means the access token and user data
        // were passed back in the response object.
        if (response.status === 200) {
            try {
                // Attempt to set the user cookies by utilizing the API Service and pass the access token, refresh token,
                // and language data for tha app.
                const loginResult = await LoginController.setCookies(response.data.refreshToken, response.data.token, locale, languageData);
                // Handle the login action.
                handleResponseAction(loginResult, response.data)
            } catch (error) {
                // Handle the error.
                handleResponseAction({ type: "danger", content: error });
            }
        } else {
            // Handle the result from the login response check.
            handleResponseAction(loginResponse, response.data);
        }
    }

    // Render the Login View.
    return (
        <Container className="mt-5">
            <Row className="mt-5 justify-content-center">
                <Col xl="6" md="12" className="mt-5 mx-auto">
                    <Card className="bg-primary-card">
                        <CardHeader>
                            { get(languageData, ["common", "login"]) }
                        </CardHeader>
                        <CardBody>
                            { formAlert.type &&
                                <Alert color={ formAlert.type }>
                                    { formAlert.content }
                                </Alert>
                            }

                            <Form role="form" onSubmit={ handleFormSubmit }>
                                { map(LoginForm, (input, key) => (
                                    <Input
                                        autoFocus={ key === 0 }
                                        key={ get(input, "name") }
                                        inputColXL={ get(input, "inputColXL") }
                                        inputColMD={ get(input, "inputColMD") }
                                        inputColClassName={ get(input, "inputColClassName") }
                                        id={ get(input, "id") }
                                        name={ get(input, "name") }
                                        type={ get(input, "type") }
                                        label={ get(languageData, ["common", "auth", "login", get(input, "name"), "label"]) }
                                        value={ formData[get(input, "name")] }
                                        placeholder={ get(languageData, ["common", "auth", "login", get(input, "name"), "placeholder"]) }
                                        onChange={ handleInputChange }
                                        prependIcon={ get(input, "prependIcon") }
                                        validation={ get(input, "validation") }
                                    />
                                )) }

                                <FormGroup className="text-center">
                                    <CustomButton text={ get(languageData, ["common", "auth", "login", "signin"]) } className="my-3 bg-primary" type="submit" />
                                </FormGroup>
                            </Form>

                            <Row className="text-center">
                                <Col className="text-center">
                                    <Link to={ links.auth.forgotPassword } title={ get(languageData, ["common", "auth", "login", "forgotPassword"]) }>
                                        <small>{ get(languageData, ["common", "auth", "login", "forgotPassword"]) }</small>
                                    </Link>
                                </Col>
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

// Export the Login View.
export default connect(mapStateToProps, { setUser })(Login);