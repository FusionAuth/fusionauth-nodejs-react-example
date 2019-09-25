// Dependencies
import React, { useEffect } from "react";
import { get } from "lodash";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import classNames from "classnames";
import {
    Card,
    CardHeader,
    CardBody,
    Container,
    Row,
    Col
} from "reactstrap";

// Config
import { config, links } from "../../../config";

// API
import APIFetch from "../../../util/APIFetch";
import TodoAPI from "../TodoAPI";

// Components
import CustomButton from "../../../components/CustomButton";

// Page Data
import TodoViewPageData from "./TodoViewPageData";

// History
import History from "../../../util/History";

// Toasty
import Toasty from "../../../util/Toasty";

/**
 * Todo Item View
 *
 * The Todo view contains information for all of the user's Todo list items. From here,
 * they are able to edit, view, and delete the individual Todo items.
 *
 * @param {Object} match Information about the view's route.
 * @param {String} locale The current locale of the application.
 * @param {Object} languageData Current language information for the app. Language data object.
 */
const TodoView = ({ match, locale, languageData }) => {
    // Setup the API Fetch utility for the Todo View.
    const [{ isLoading, results, hasError }] = APIFetch({
        locale,
        BASEURL: config.apiServer.BASEURL,
        PATH_SEARCH: TodoAPI.apiService.getTodo.PATH_SEARCH,
        PATH_METHOD: TodoAPI.apiService.getTodo.PATH_METHOD,
        PATH_QUERY: `?id=${ match.params.id }`
    });

    // Create a dynamic class name for the panel that will center the text
    // if the result status is not 200.
    const isCenteredText = classNames({
        "mx-auto": isLoading || get(results, "status") !== 200
    });

    /**
     * Listen to changes in the error state.
     */
    useEffect(() => {
        const handleError = () => {
            // Check the error results and direct the user accordingly.
            if (get(hasError, "status") === 410) {
                // Let the user know the item does not exist.
                Toasty.notify({
                    type: Toasty.error(),
                    content: hasError.data.message
                });

                // Redirect the user to the proper page.
                History.push(links.todo.list);
            }
        }

        handleError();
    }, [hasError]);

    // Render the Todo Item View.
    return (
        <Container className="mt-5">
            <Row className="mt-5 justify-content-center">
                <Col xl="6" md="12" className="mt-5 mx-auto">
                    <Card className="bg-primary-card">
                        <CardHeader className="d-flex align-items-center">
                            { get(languageData, ["common", "todo", "view", "title"]) }

                            <span className="ml-auto">
                                <Link to={ `${ links.todo.edit }${ match.params.id }` }>
                                    <CustomButton color="warning" text={ get(languageData, ["common", "edit"]) } />
                                </Link>
                            </span>
                        </CardHeader>
                        <CardBody className={ isCenteredText }>
                            <TodoViewPageData
                                isLoading={ isLoading }
                                results={ results }
                                hasError={ hasError }
                                languageData={ languageData }
                            />
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

// Export the Todo Item View.
export default connect(mapStateToProps)(TodoView);
