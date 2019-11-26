// Dependencies
import React, { useState, useEffect } from "react";
import { get, map, isEmpty } from "lodash";
import { connect } from "react-redux";
import classNames from "classnames";
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
import { config, links } from "../../../../config";

// Components
import CustomButton from "../../../../components/CustomButton";
import VerifyEmailPageData from "./VerifyEmailPageData";

// Form
import FormHandler from "../../../../util/FormHandler";
import ValidateInput from "../../../../util/ValidateInput";
import Input from "../../../../components/Form/Input";
import VerifyEmailForm from "./VerifyEmailForm.json";

// API
import APIFetch from "../../../../util/APIFetch";
import VerifyEmailAPI from "./VerifyEmailAPI";

// History
import History from "../../../../util/History";

// Toasty
import Toasty from "../../../../util/Toasty";

/**
 * Verify Email View
 *
 * Allows the user to verify their email for the application.
 *
 * @param {Object} match Information about the view's route.
 * @param {Object} location Information about the view's location.
 * @param {String} locale The current locale of the application.
 * @param {Object} languageData Current language information for the app. Language data object.
 */
const VerifyEmail = ({ match, location, locale, languageData }) => {
    // Setup initial state.
    const [formData, setFormData] = useState({});
    const [formErrors, setFormErrors] = useState(false);
    const [submittingForm, setSubmittingForm] = useState(false);
    const [formAlert, setFormAlert] = useState({ type: null });

    // Get the verification ID from the URL.
    const verificationId = get(match, ["params", "verificationId"]);

    // Setup the API Fetch utility for the Verify Email View.
    const [{ fetchResults, isLoading, hasError }] = APIFetch({
        locale,
        BASEURL: config.apiServer.BASEURL,
        PATH_SEARCH: VerifyEmailAPI.apiService.postEmailVerify.PATH_SEARCH,
        PATH_METHOD: VerifyEmailAPI.apiService.postEmailVerify.PATH_METHOD,
        formData
    });

    // Check if the user was directed to the view from the register view so a message can be displayed.
    if ((get(location, ["state", "displayMessage"]) === true) && (get(formAlert, "type") === null)) {
        setFormAlert({
            type: "info",
            content: get(languageData, ["common", "auth", "verifyEmail", "displayMessage"])
        });
    }

    /**
     * Check if the verification ID is in the URL
     *
     * Checks if the user came here directly with a link. If so, then update the
     * form state with the verification ID and a boolean to auto submit the form.
     */
    if (isEmpty(formData) && verificationId) {
        setFormData({
            autoSubmit: true,
            verificationId: {
                value: verificationId
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
            if (get(formData, "autoSubmit") || (!didCancel && submittingForm && !formErrors)) {
                try {
                    // Send the API request.
                    const response = await fetchResults(formData);

                    // Display a message so the user knows the verification was successful.
                    Toasty.notify({
                        type: Toasty.success(),
                        content: response.data.message
                    });

                    // Send the user to the login page.
                    History.push(links.auth.login);
                } catch (error) {
                    // Make sure we don't try to change state after re-render.
                    if (!didCancel) {
                        if (!verificationId) {
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
     * will verify the verification token.
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
        Promise.all(map(VerifyEmailForm, input => (
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

     /**
     * Display inputs
     *
     * Extracted out the custom input display element for the page since there
     * is logic to determine whether or not to show inputs.
     *
     * @param {Object} input Object with data about the input to display.
     * @param {String} key Unique key for displaying the input.
     */
    const displayInput = (input, key) => (
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
    );

    // Create a dynamic class name for the panel that will center the text
    // if the result status is not 200.
    const isCenteredText = classNames({
        "mx-auto": verificationId
    });

    // Render the Verify Email View.
    return (
        <Container className="mt-5">
            <Row className="mt-5 justify-content-center">
                <Col xl="6" md="12" className="mt-5 mx-auto">
                    <Card className="bg-primary-card">
                        <CardHeader>
                            { get(languageData, ["common", "verifyEmail"]) }
                        </CardHeader>
                        <CardBody className={ isCenteredText }>
                            { formAlert.type &&
                                <Alert color={ formAlert.type }>
                                    { formAlert.content }
                                </Alert>
                            }
                            <Form role="form" onSubmit={ handleFormSubmit }>
                                <Row>
                                    { verificationId
                                        ?   <VerifyEmailPageData
                                                isLoading={ isLoading }
                                                hasError={ hasError }
                                            />
                                        :   map(VerifyEmailForm, (input, key) => (
                                                displayInput(input, key)
                                            ))
                                    }
                                </Row>
                                <FormGroup className="text-center">
                                    { !verificationId &&
                                        <CustomButton text={ get(languageData, ["common", "verify"]) } className="my-3 bg-primary" type="submit" disabled={ submittingForm } />
                                    }
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

// Export the Verify Email View.
export default connect(mapStateToProps)(VerifyEmail);
