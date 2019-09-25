// Dependencies
import React, { useState, useEffect } from "react";
import { get, map } from "lodash";
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

// Components
import CustomButton from "../../../components/CustomButton";

// Config
import { config, links } from "../../../config";

// Form
import FormHandler from "../../../util/FormHandler";
import ValidateInput from "../../../util/ValidateInput";
import Input from "../../../components/Form/Input";
import RegisterForm from "./RegisterForm.json";

// API
import APIFetch from "../../../util/APIFetch";
import RegisterAPI from "./RegisterAPI";

// History
import History from "../../../util/History";

// Toasty
import Toasty from "../../../util/Toasty";

/**
 * Register View
 *
 * Handle the registration view and the functions necessary to perform
 * registration and error checking.
 *
 * @param {String} locale The current locale of the application.
 * @param {Object} languageData Current language information for the app. Language data object.
 */
const Register = ({ locale, languageData }) => {
    // Setup initial state.
    const [formData, setFormData] = useState({});
    const [formErrors, setFormErrors] = useState(false);
    const [submittingForm, setSubmittingForm] = useState(false);
    const [formAlert, setFormAlert] = useState({ type: null });

    // Setup the API Fetch utility for the Register View.
    const [{ fetchResults }] = APIFetch({
        locale,
        BASEURL: config.apiServer.BASEURL,
        PATH_SEARCH: RegisterAPI.apiService.postRegister.PATH_SEARCH,
        PATH_METHOD: RegisterAPI.apiService.postRegister.PATH_METHOD,
        formData
    });

    /**
     * Get a second value for form validation
     *
     * Get the password value to send to the validation function if the input is the `confirmPassword` input.
     *
     * @param {String} target Name of the input field.
     */
    const secondValue = target => {
        return target === "confirmPassword" ? get(formData, ["password", "value"]) : null;
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
        // Get the right value for the type of input.
        const value = target.type !== "checkbox" ? target.value : get(formData[target.name], "value") === true ? false : true;

        // Check if the input type is checkbox.
        if (target.type === "checkbox") {
            // The checkbox is updated on blur, but that's not quite quick enough. Try
            // to force validation on the checkbox when it's value / state changes.
            const validRules = RegisterForm.filter(input => input.name === target.name)[0]["validation"];
            validate(target.name, ValidateInput(value, target.type, validRules, languageData), value);
        }

        // Update state with new value for the input.
        setFormData(prevState => {
            return {
                ...prevState,
                [target.name]: {
                    ...formData[target.name],
                    value
                }
            }
        });
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
            // Make sure we don't try to change state after re-render.
            if (!didCancel) {
                if (submittingForm && !formErrors) {
                    try {
                        // Send the API request.
                        const response = await fetchResults(formData);

                        // Display a message so the user knows the registration was successful.
                        Toasty.notify({
                            type: Toasty.success(),
                            content: response.data.message
                        });

                        // Send the user to the registration verification page.
                        History.push({
                            pathname: links.auth.verifyEmail,
                            state: {
                                displayMessage: true
                            }
                        });
                    } catch (err) {
                        // Extract the error array to a new variable for access.
                        const error = err.data.message;
                        // Setup a new array for the form alert.
                        let errors = [];

                        // Check the length of the error array.
                        if (error.length === 1) {
                            // If the array only has one item, change the errors variable
                            // from an array to plain text.
                            errors = error[0];
                        } else {
                            // Map over the errors in the response.
                            map(error, (errorText, key) => {
                                // Push a list item version of the error to the errors variable.
                                errors.push(<li key={ key }>{ errorText }</li>);
                            });
                        }

                        // Make sure we don't try to change state after re-render.
                        if (!didCancel) {
                            // Update the UI with the form error.
                            setFormAlert({ type: "danger", content: errors });

                            // Reset the form submit state.
                            setSubmittingForm(false);
                        }
                    }
                } else {
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
     * Performs a request to the API Service upon form submittal. This
     * will verify the user registration information.
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
        Promise.all(map(RegisterForm, input => {
            validate(get(input, "name"), ValidateInput(get(formData[get(input, "name")], "value") || "", get(input, "type"), get(input, "validation"), languageData, secondValue(get(input, "name"))))
        }));
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

    // Render the Register View.
    return (
        <Container className="mt-5">
            <Row className="mt-5 justify-content-center">
                <Col xl="6" md="12" className="mt-5 mx-auto">
                    <Card className="bg-primary-card">
                        <CardHeader>
                            { get(languageData, ["common", "register"]) }
                        </CardHeader>
                        <CardBody>
                            { formAlert.type &&
                                <Alert color={ formAlert.type }>
                                    { formAlert.content }
                                </Alert>
                            }
                            <Form role="form" onSubmit={ handleFormSubmit }>
                                <Row>
                                    { map(RegisterForm, (input, key) => (
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
                                            labelMuted={ get(input, "labelMuted") }
                                            value={ get(formData[get(input, "name")], "value") }
                                            placeholder={ get(languageData, ["common", "input", get(input, "name"), "placeholder"]) }
                                            onChange={ handleInputChange }
                                            handleFormSubmit={ handleFormSubmit }
                                            validate={ validate }
                                            prependIcon={ get(input, "prependIcon") }
                                            inputClassName={ FormHandler.inputStatus(formData, get(input, "name")) }
                                            inputCheckboxClassName={ get(input, "inputClassName") }
                                            success={ get(formData[get(input, "name")], "validText") }
                                            error={ get(formData[get(input, "name")], "errorText") }
                                            languageData={ languageData }
                                            validation={ get(input, "validation") }
                                            secondValue={ secondValue(get(input, "name")) }
                                        />
                                    )) }
                                </Row>
                                <FormGroup className="text-center">
                                    <CustomButton text={ get(languageData, ["common", "auth", "register", "createAccount"]) } className="my-3 bg-primary" type="submit" disabled={ submittingForm } />
                                </FormGroup>
                            </Form>
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
export default connect(mapStateToProps)(Register);