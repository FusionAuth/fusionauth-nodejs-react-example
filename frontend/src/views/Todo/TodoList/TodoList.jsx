// Dependencies
import React from "react";
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
import TodoListPageData from "./TodoListPageData";

/**
 * Todo List View
 *
 * The Todo view contains information for all of the user's ToDo items. From here,
 * they are able to view the individual Todo items.
 *
 * @param {String} locale The current locale of the application.
 * @param {Object} languageData Current language information for the app. Language data object.
 */
const TodoList = ({ locale, languageData }) => {
    // Setup the API Fetch utility for the Todo List View.
    const [{ isLoading, results, hasError }] = APIFetch({
        locale,
        BASEURL: config.apiServer.BASEURL,
        PATH_SEARCH: TodoAPI.apiService.getTodos.PATH_SEARCH,
        PATH_METHOD: TodoAPI.apiService.getTodos.PATH_METHOD
    });

    // Create a dynamic class name for the panel that will center the text
    // if the result status is not 200.
    const isCenteredText = classNames({
        "mx-auto": isLoading || get(results, "status") !== 200
    });

    // Render the Todo List View.
    return (
        <Container className="mt-5">
            <Row className="mt-5 justify-content-center">
                <Col xl="6" md="12" className="mt-5 mx-auto">
                    <Card className="bg-primary-card">
                        <CardHeader className="d-flex align-items-center">
                            { get(languageData, ["common", "todo", "list", "title"]) }

                            <span className="ml-auto">
                                <Link to={links.todo.add}>
                                    <CustomButton color="success" text={ get(languageData, ["common", "add"]) } />
                                </Link>
                            </span>
                        </CardHeader>
                        <CardBody className={ isCenteredText }>
                            <TodoListPageData
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

// Export the Todo List View.
export default connect(mapStateToProps)(TodoList);
