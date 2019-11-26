// Dependencies
import React, { useState, useEffect } from "react";
import { get, isEmpty, map } from "lodash";
import { connect } from "react-redux";
import classNames from "classnames";
import { Link } from "react-router-dom";
import {
    Card,
    CardHeader,
    CardBody,
    Container,
    Row,
    Col,
    Form,
    FormGroup,
    Alert
} from "reactstrap";

// Config
import { config, links } from "../../../config";

// API
import APIFetch from "../../../util/APIFetch";
import TodoAPI from "../TodoAPI";

// Form
import FormHandler from "../../../util/FormHandler";
import ValidateInput from "../../../util/ValidateInput";
import Input from "../../../components/Form/Input";
import TodoModifyForm from "./TodoModifyForm.json";

// Toasty
import Toasty from "../../../util/Toasty";

// History
import History from "../../../util/History";

// Components
import CustomButton from "../../../components/CustomButton";
import TodoModifyPageData from "./TodoModifyPageData";

/**
 * Todo Modify View
 *
 * The Todo Modify view contains information for adding a ToDo for the current logged
 * in user, editing a ToDo for the current logged in user, and for deleting a ToDo.
 *
 * @param {Object} match Information about the view's route.
 * @param {Object} location Information about the view's location.
 * @param {String} locale The current locale of the application.
 * @param {Object} languageData Current language information for the app. Language data object.
 */
const TodoModify = ({ match, location, locale, languageData }) => {
    // Setup initial state.
    const [formData, setFormData] = useState({});
    const [formErrors, setFormErrors] = useState(false);
    const [submittingForm, setSubmittingForm] = useState(false);
    const [formAlert, setFormAlert] = useState({ type: null });

    // Status code for items that do not exist.
    const ToDoDNEStatus = 410;

    // Create a boolean to display the right content for Add vs Edit view.
    const isAddingToDo = location.pathname.includes("add") ? true : false;
    const viewName = isAddingToDo ? "add" : "edit";
    const viewURL = isAddingToDo ? "addTodo" : "editTodo";

    // Setup the API Fetch utility for the Todo Add View.
    const [{ fetchResults }] = APIFetch({
        locale,
        BASEURL: config.apiServer.BASEURL,
        PATH_SEARCH: TodoAPI.apiService[viewURL].PATH_SEARCH,
        PATH_METHOD: TodoAPI.apiService[viewURL].PATH_METHOD
    });

    // Setup the API Fetch utility for the Todo Edit View.
    const [{ isLoading: editLoading, results: editResults, hasError: editError }] = APIFetch({
        locale,
        BASEURL: config.apiServer.BASEURL,
        PATH_SEARCH: TodoAPI.apiService.getTodo.PATH_SEARCH,
        PATH_METHOD: TodoAPI.apiService.getTodo.PATH_METHOD,
        PATH_QUERY: `?id=${ match.params.id }`,
        formData
    });

    // Setup the API Fetch utility to delete a Todo item.
    const [{ fetchResults: deleteTodo }] = APIFetch({
        locale,
        BASEURL: config.apiServer.BASEURL,
        PATH_SEARCH: TodoAPI.apiService.deleteTodo.PATH_SEARCH,
        PATH_METHOD: TodoAPI.apiService.deleteTodo.PATH_METHOD,
        PATH_QUERY: `?id=${ match.params.id }`
    });

    // Get ToDo data for edit form.
    if (!isAddingToDo) {
        // ToDo Data for edit form.
        const todoData = get(editResults, ["data", "content"]);

        // Make sure formData is empty and todoData is not empty to prevent multiple re-renders.
        if (isEmpty(formData) && !isEmpty(todoData)) {
            // Map over the result data.
            map(todoData, (value, key) => {
                // Only grab the information that we want.
                if (["_id", "name", "description", "done"].includes(key)) {
                    // Update the formData state.
                    setFormData(prevState => {
                        return {
                            ...prevState,
                            [key]: {
                                ...formData[key],
                                value,
                                error: false,
                                errorText: "",
                                validText: ""
                            }
                        }
                    });
                }
            });
        }
    }

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
        // Get the right value for the type of input.
        const value = target.type !== "checkbox" ? target.value : get(formData[target.name], "value") === true ? false : true;

        // Update state with new value for the input.
        setFormData({
            ...formData,
            [target.name]: {
                ...formData[target.name],
                value
            }
        });
    };

    /**
     * Delete a ToDo item
     *
     * Deletes a ToDo item with the given current ID. Ensures the user is the owner
     * to delete the item.
     */
    const deleteHandler = () => {
        // Send the API request.
        deleteTodo()
            .then(response => {
                // Let the user know that the deletion was a success.
                Toasty.notify({
                    type: Toasty.success(),
                    content: response.data.message
                });

                // Redirect the user since the ToDo item no longer exists.
                History.push(links.todo.list)
            })
            .catch(error => {
                // Display a message so the user knows that there was an error.
                Toasty.notify({
                    type: Toasty.error(),
                    content: error.data.message
                });

                // Redirect the user only if the ToDo item does not exist.
                if (get(error, "status") === ToDoDNEStatus) {
                    // Redirect the user to the ToDo list page
                    History.push(links.todo.list);
                }
            });
    }

    /**
     * Handle errors for editing
     *
     * Allows specific errors for the edit form to the handled appropriately.
     */
    useEffect(() => {
        const handleError = () => {
            // Make sure we're editing a ToDo item and the edit errors are not empty.
            if (!isAddingToDo && !isEmpty(editError)) {
                if (editError.status === ToDoDNEStatus) {
                    // Display a message so the user knows that there was an error.
                    Toasty.notify({
                        type: Toasty.error(),
                        content: editError.data.message
                    });

                    // Redirect the user to the ToDo list page
                    History.push(links.todo.list);
                } else {
                    // Update the UI with the form error.
                    setFormAlert({ type: "danger", content: editError.data.message });
                }
            }
        }

        handleError();
    }, [isAddingToDo, editError]);

    /**
     * Handle form submit
     *
     * We need to be able to handle the form submit which can only by done by watching
     * for state changes in `submittingForm` and `formErrors`. This handler works for
     * both add and edit views.
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

                    // Display a message so the user knows their ToDo was modified or added.
                    Toasty.notify({
                        type: Toasty.success(),
                        content: response.data.message
                    });

                    // Determine next action after the successful submit.
                    if (isAddingToDo) {
                        // Make sure we don't try to change state after re-render.
                        if (!didCancel) {
                            // Update the UI and clear the form after adding the ToDo.
                            setFormData({});
                        }
                    } else {
                        // Move the user to the edited ToDo's view.
                        History.push(`${ links.todo.list }${ match.params.id }`);
                    }
                } catch (error) {
                    // Make sure we don't try to change state after re-render.
                    if (!didCancel) {
                        // Update the UI with the form error.
                        setFormAlert({ type: "danger", content: error.data.message });
                    }
                }

                // Make sure we don't try to change state after re-render.
                if (!didCancel) {
                    // Reset the form submit state.
                    setSubmittingForm(false);
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
     * Performs a request to the API Service upon form submittal. This will validate the input
     * before attempting to save it to the database.
     *
     * @param {object} e Form object that executed the function.
     */
    const handleFormSubmit = e => {
        // Pervent the form from redirecting the user.
        e.preventDefault();

        // Set Form errors to false to reset the state.
        setFormErrors(false);
        // Set submitting form to true so that we can submit it.
        setSubmittingForm(true);
        // Reset the form alert.
        setFormAlert({ type: null })

        // Loop through the form inputs to validate them before submitting the request to the
        // API Service.
        Promise.all(map(TodoModifyForm, input => (
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
            autoFocus={ key === 1 }
            key={ get(input, "name") }
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
            rows={ get(input, "rows") }
            prependIcon={ get(input, "prependIcon") }
            inputClassName={ FormHandler.inputStatus(formData, get(input, "name")) }
            inputCheckboxClassName={ get(input, "inputClassName") }
            success={ get(formData[get(input, "name")], "validText") }
            error={ get(formData[get(input, "name")], "errorText") }
            languageData={ languageData }
            validation={ get(input, "validation") }
        />
    );

    /**
     * Display Form
     *
     * Display elements for the rendered view to be displayed. Extracted
     * to a component function in order to be rendered conditionally.
     */
    const displayForm = () => (
        <Form role="form" onSubmit={ handleFormSubmit }>
            { map(TodoModifyForm, (input, key) => (
                isAddingToDo
                    ? get(input, "name") !== "done" && displayInput(input, key)
                    : displayInput(input, key)
            )) }

            <FormGroup className="text-center">
                <Link to={ isAddingToDo ? links.todo.list : `${ links.todo.list }${ match.params.id }` }>
                    <CustomButton color="info" text={ get(languageData, ["common", "cancel"]) } className="mr-2" />
                </Link>
                <CustomButton text={ get(languageData, ["common", "save"]) } className="my-3 bg-primary" type="submit" disabled={ submittingForm } />
            </FormGroup>
        </Form>
    );

    // Create a dynamic class name for the panel that will center the text
    // if the result status is not 200 for the edit view.
    const isCenteredText = classNames({
        "mx-auto": editLoading
    });

    // Render the Todo Modify View.
    return (
        <Container className="mt-5">
            <Row className="mt-5 justify-content-center">
                <Col xl="6" md="12" className="mt-5 mx-auto">
                    <Card className="bg-primary-card">
                        <CardHeader className="d-flex align-items-center">
                            { isAddingToDo
                                ?   get(languageData, ["common", "todo", viewName, "title"])
                                :   <>
                                        { get(languageData, ["common", "todo", viewName, "title"]) }
                                        <span className="ml-auto">
                                            <CustomButton color="danger" text={ get(languageData, ["common", "delete"]) } onClick={ deleteHandler } />
                                        </span>
                                    </>
                            }
                        </CardHeader>
                        <CardBody className={ isCenteredText }>
                            { formAlert.type &&
                                <Alert color={ formAlert.type }>
                                    { formAlert.content }
                                </Alert>
                            }

                            { isAddingToDo
                                ? displayForm()
                                :   <TodoModifyPageData
                                        isLoading={ editLoading }
                                        results={ editResults }
                                        hasError={ editError }
                                        component={ displayForm }
                                    />
                            }
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

// Export the Todo Modify View.
export default connect(mapStateToProps)(TodoModify);