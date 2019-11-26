// Dependencies
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { get, map } from "lodash";
import QRCode from "qrcode.react";
import {
    Row,
    Col,
    Form,
    FormGroup,
    Alert
} from "reactstrap";

// Config
import { config } from "../../../../config";

// Components
import CustomButton from "../../../../components/CustomButton";

// Enable 2FA Controller
import Enable2FAController from "./Enable2FAController";

// API
import APIFetch from "../../../../util/APIFetch";
import Enable2FAAPI from "./Enable2FAAPI";

// Form
import FormHandler from "../../../../util/FormHandler";
import ValidateInput from "../../../../util/ValidateInput";
import Input from "../../../../components/Form/Input";
import Enable2FAForm from "./Enable2FAForm.json";

/**
 * User 2Factor Enable View
 *
 * Allows the user to enable 2Factor Authentication.
 *
 * @param {Object} content The response content from the API service with the info to create a QR Code.
 * @param {String} locale The current locale of the application.
 * @param {Object} languageData Current language information for the app. Language data object.
 */
const Enable = ({ content, locale, languageData }) => {
    // Setup Initial State
    const [formData, setFormData] = useState({
        secret: {
            value: content.secret
        }
    });
    const [formErrors, setFormErrors] = useState(false);
    const [submittingForm, setSubmittingForm] = useState(false);
    const [formAlert, setFormAlert] = useState({ type: null });

    // Setup the API Fetch utility for the User 2FA Disable View.
    const [{ fetchResults }] = APIFetch({
        locale,
        BASEURL: config.apiServer.BASEURL,
        PATH_SEARCH: Enable2FAAPI.apiService.postEnable2FA.PATH_SEARCH,
        PATH_METHOD: Enable2FAAPI.apiService.postEnable2FA.PATH_METHOD,
        formData
    });

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
     * Handle User 2Factor Enable Actions
     *
     * Used to efficiently handle responses from the User 2Factor
     * Enable requests to either redirect the user or to display a
     * message to the user.
     *
     * @param {Object} responseObj Response object from the request.
     * @param {Object} data Data object required for handling the action.
     */
    const handleResponseAction = (responseObj, data) => {
        // Handle appropriate actions with the User 2Factor Enable controller.
        const response = Enable2FAController.handleAction(responseObj, data);

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
            if (!didCancel && submittingForm && !formErrors) {
                try {
                    // Send the API request.
                    const response = await fetchResults(formData);

                    // Determine what to do with the user based on the success response from the API service.
                    const enable2FactorResponse = await Enable2FAController.handleResponse(response, languageData);

                    // Handle the result from the User 2Factor Enable request.
                    handleResponseAction(enable2FactorResponse, response.data);
                } catch (error) {
                    // Make sure we don't try to change state after re-render.
                    if (!didCancel) {
                        // Error will have a type if the result is from the User 2Factor Enable Controller.
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
     * will attempt to enable 2Factor for the user.
     *
     * @param {object} e Form object that executed the function.
     */
    const handleFormSubmit = async e => {
        // Pervent the form from redirecting the user.
        e.preventDefault();

        // Set Form errors to false to reset the state.
        setFormErrors(false);
        // Set submitting form to true so that we can submit it.
        setSubmittingForm(true);
        // Reset the form alert.
        setFormAlert({ type: null });

        // Loop through the form inputs to validate them before submitting the request to the
        // API Service.
        Promise.all(map(Enable2FAForm, input => (
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

    // Render the User 2Factor Enable View.
    return (
        <>
            <Row>
                <Col className="mb-4">
                    { get(languageData, ["common", "user", "enable2Factor", "descrption"]) }
                </Col>
            </Row>
            <Row className="mb-1 mx-auto">
                <Col>
                    <QRCode value={ `otpauth://totp/${ content.email }?issuer=${ config.app.TWO_FA_NAME }&secret=${ content.secretBase32Encoded }` } size={ 256 } />
                </Col>
            </Row>
            <Row className="mb-3 small text-center">
                <Col>
                    { get(languageData, ["common", "user", "enable2Factor", "manualCodeEnter"]) } <b>${ content.secretBase32Encoded }</b>
                </Col>
            </Row>
            <Form role="form" onSubmit={ handleFormSubmit } className="col-md-12">
                { formAlert.type &&
                    <Alert color={ formAlert.type }>
                        { formAlert.content }
                    </Alert>
                }
                <Row>
                    {   map(Enable2FAForm, (input, key) => (
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
                    <CustomButton text={ get(languageData, ["common", "enable2Factor"]) } className="my-3 bg-primary" type="submit" disabled={ submittingForm } />
                </FormGroup>
            </Form>
        </>
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

// Export the User 2Factor Enable View.
export default connect(mapStateToProps)(Enable);
