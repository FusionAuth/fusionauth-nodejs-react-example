// Dependencies
import React, { useState, useEffect } from "react";
import { get, map, isEmpty } from "lodash";
import { connect } from "react-redux";
import {
    Alert,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Container,
    Row,
    Col
} from "reactstrap";

// Config
import { config } from "../../../../config";

// Components
import CustomButton from "../../../../components/CustomButton";

// Redux Actions
import { setUser } from "../../../../redux/actions";

// Verify 2FA Controller
import Verify2FactorController from "./Verify2FactorController";

// Form
import FormHandler from "../../../../util/FormHandler";
import ValidateInput from "../../../../util/ValidateInput";
import Input from "../../../../components/Form/Input";
import Verify2FactorForm from "./Verify2FactorForm.json";

// API
import APIFetch from "../../../../util/APIFetch";
import Verify2FactorAPI from "./Verify2FactorAPI";

/**
 * Verify 2Factor View
 *
 * Allows the user to verify their account to continue the login process.
 *
 * @param {Object} location Information about the view's location.
 * @param {Function} setUser Redux action to set the user.
 * @param {String} locale The current locale of the application.
 * @param {Object} languageData Current language information for the app. Language data object.
 */
const Verify2FA = ({ location, setUser, locale, languageData }) => {
    // Setup initial state.
    const [formData, setFormData] = useState({});
    const [formErrors, setFormErrors] = useState(false);
    const [submittingForm, setSubmittingForm] = useState(false);
    const [formAlert, setFormAlert] = useState({ type: null });

    // Get the two factor ID from the location object.
    const twoFactorId = get(location, ["state", "twoFactorId"]);

    // Setup the API Fetch utility for the 2Factor View.
    const [{ fetchResults }] = APIFetch({
        locale,
        BASEURL: config.apiServer.BASEURL,
        PATH_SEARCH: Verify2FactorAPI.apiService.post2FAVerfiy.PATH_SEARCH,
        PATH_METHOD: Verify2FactorAPI.apiService.post2FAVerfiy.PATH_METHOD,
        formData
    });

    // Check if the user was directed from a page in the application so a message can be displayed.
    if ((get(location, ["state", "displayMessage"]) === true) && (get(formAlert, "type") === null) && twoFactorId) {
        setFormAlert({
            type: "info",
            content: get(languageData, ["common", "auth", "verify2Factor", "displayMessage"])
        });
    }

    /**
     * Check if the two factor ID was not passed
     *
     * We need the two factor ID in order to log the user in, so alert the user that there
     * is a problem.
     */
    if (isEmpty(formData) && (get(formAlert, "type") === null) && !twoFactorId) {
        setFormAlert({
            type: "danger",
            content: get(languageData, ["common", "auth", "verify2Factor", "no2FA"])
        });
    }

    /**
     * Check if the two factor ID was passed
     *
     * We need the two factor ID in order to log the user in, so update the value in
     * the formData object.
     */
    if (isEmpty(formData) && twoFactorId) {
        setFormData({
            twoFactorId: {
                value: twoFactorId
            }
        });
    }

    /**
     * Handle input changes
     *
     * Update the formData object to hold the newest value for an input
     * when the value is changed. This is done so we can have a single source
     * of truth for the inputs.
     *
     * @param {object} target Event object that executed the function.
     */
    const handleInputChange = ({ target }) => {
        // Update state with new value for the input.
        setFormData({
            ...formData,
            [target.name]: {
                ...formData[target.name],
                value: target.value
            }
        });
    };

    /**
     * Handle 2Factor Actions
     *
     * Used to efficiently handle responses from the 2FA requests to either
     * redirect the user or to display a message to the user.
     *
     * @param {Object} responseObj Response object from the request.
     * @param {Object} data Data object required for handling the action.
     */
    const handleResponseAction = (responseObj, data) => {
        // Handle response actions with the 2Factor controller.
        const response = Verify2FactorController.handleAction(responseObj, data, setUser);

        // Check if there is a response to be handled.
        if (response) {
            // Set the form alert information.
            setFormAlert(response);
        }
    };

    /**
     * Handle form submit
     *
     * We need to be able to handle the form submit which can only by done by watching
     * for state changes in `submittingForm` and `formErrors`.
     */
    useEffect(() => {
        // Set a variable so we can cancel the request if needed (ex, user
        // moves to a new page).
        let didCancel = false;

        /**
         * Handles form submit.
         */
        const submitForm = async () => {
            if (twoFactorId && !didCancel && submittingForm && !formErrors) {
                try {
                    // Send the API request.
                    const response = await fetchResults(formData);

                    // Determine what to do with the user based on the success response from the API service.
                    const verify2FAResponse = await Verify2FactorController.handleResponse(response, languageData);

                    // Handle the result from the login response check.
                    handleResponseAction(verify2FAResponse, response.data);
                } catch (error) {
                    // Make sure we don't try to change state after re-render.
                    if (!didCancel) {
                        // Error will have a type if the result is from the Verify2FA Controller.
                        if (get(error, "type")) {
                            // Update the UI with the form error.
                            setFormAlert({ type: error.type, content: error.content });
                        } else {
                            // Update the UI with the form error.
                            setFormAlert({ type: "danger", content: error.data.message });
                        }

                        // Reset the form submit state.
                        setSubmittingForm(false);
                    }
                }
            } else {
                // Make sure we don't try to change state after re-render.
                if (!didCancel) {
                    // Reset the form submit state.
                    setSubmittingForm(false);

                    // No 2FA ID passed, so alert the user.
                    if (!twoFactorId) {
                        setFormAlert({
                            type: "danger",
                            content: get(languageData, ["common", "auth", "verify2Factor", "no2FA"])
                        });
                    }
                }
            }
        }

        // Call the submitForm function to handle the form's submit action.
        submitForm();

        /**
         * Perform action when the component is unmounted
         *
         * The return function in useEffect is equivalent to componentWillUnmount and
         * can be used to cancel the API request.
         */
        return () => {
            // Set the canceled variable to true.
            didCancel = true;
        };

        // eslint-disable-next-line
    }, [submittingForm, formErrors]);

    /**
     * Form Submit Handler
     *
     * Performs a request to the API Serivce upon form submittal. This
     * will verify the 2FA code.
     *
     * @param {object} e Form object that executed the function.
     */
    const handleFormSubmit = async e => {
        // Prevent the form from refreshing the page.
        e.preventDefault();

        // Set Form errors to false to reset the state.
        setFormErrors(false);
        // Set submitting form to true so that we can submit it.
        setSubmittingForm(true);
        // Reset the form alert.
        setFormAlert({ type: null });

        // Loop through the form inputs to validate them before submitting the request to the
        // API Service.
        Promise.all(map(Verify2FactorForm, input => (
            validate(get(input, 'name'), ValidateInput(get(formData[get(input, "name")], "value") || "", get(input, "type"), get(input, "validation"), languageData))
        )));
    }

    /**
     * Validate form inputs
     *
     * Perform input validation on form blur and update the `formData` as necessary.
     *
     * @param {String} target Name of the input to set validation info for.
     * @param {Array} error Error list for the input.
     */
    const validate = (target, error) => {
        // Get the values based on error status.
        const { isError, errorText, validText } = FormHandler.validate(["input"], target, error, languageData);

        // If there is an error, set formErrors to true.
        if (isError) {
            setFormErrors(true);
        }

        // Set the form input state based on the results of the error, if it exists or not.
        setFormData(prevState => {
            return {
                ...prevState,
                [target]: {
                    ...formData[target],
                    error: isError,
                    errorText: errorText,
                    validText: validText
                }
            }
        });
    };

    // Render the Verify 2Factor View.
    return (
        <Container className="mt-5">
            <Row className="mt-5 justify-content-center">
                <Col xl="6" md="12" className="mt-5 mx-auto">
                    <Card className="bg-primary-card">
                        <CardHeader>
                            { get(languageData, ["common", "2fa"]) }
                        </CardHeader>
                        <CardBody>
                            { formAlert.type &&
                                <Alert color={ formAlert.type }>
                                    { formAlert.content }
                                </Alert>
                            }
                            <Form role="form" onSubmit={ handleFormSubmit }>
                                <Row>
                                    {   map(Verify2FactorForm, (input, key) => (
                                            <Input
                                                autoFocus={ key === 0 }
                                                key={ get(input, "name") }
                                                inputColXL={ get(input, "inputColXL") }
                                                inputColMD={ get(input, "inputColMD") }
                                                inputColClassName={ get(input, "inputColClassName") }
                                                id={ get(input, "id") }
                                                name={ get(input, "name") }
                                                type={ get(input, "type") }
                                                formGroupClassName={ get(input, "formGroupClassName") }
                                                label={ get(languageData, ["common", "input", get(input, "name"), "label"]) }
                                                labelClassName={ get(input, "labelClassName") }
                                                value={ get(formData[get(input, "name")], "value") }
                                                placeholder={ get(languageData, ["common", "input", get(input, "name"), "placeholder"]) }
                                                onChange={ handleInputChange }
                                                handleFormSubmit={ handleFormSubmit }
                                                validate={ validate }
                                                prependIcon={ get(input, "prependIcon") }
                                                inputClassName={ FormHandler.inputStatus(formData, get(input, "name")) }
                                                success={ get(formData[get(input, "name")], "validText") }
                                                error={ get(formData[get(input, "name")], "errorText") }
                                                languageData={ languageData }
                                                validation={ get(input, "validation") }
                                            />
                                        ))
                                    }
                                </Row>
                                <FormGroup className="text-center">
                                    <CustomButton text={ get(languageData, ["common", "verify"]) } className="my-3 bg-primary" type="submit" disabled={ submittingForm } />
                                </FormGroup>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

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

// Export the Verify 2FA View.
export default connect(mapStateToProps, { setUser })(Verify2FA);
