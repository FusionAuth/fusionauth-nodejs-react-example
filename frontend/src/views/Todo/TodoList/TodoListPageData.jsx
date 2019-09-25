// Dependencies
import React from "react";
import { Link } from "react-router-dom";
import { get, map } from "lodash";
import { Col } from "reactstrap";

// Components
import PageData from "../../../components/Util/PageData";

// Links
import { links } from "../../../config";

/**
 * ToDo List Page Data Component
 *
 * Display the user's ToDo list properly.
 *
 * @param {Boolean} isLoading Loading indication for API request.
 * @param {Object} results Result object from the API request.
 * @param {Object} hasError Error object from the API request.
 * @param {Object} languageData Current language information for the app. Language data object.
 */
const TodoPageData = ({ isLoading, results, hasError, languageData }) => {
    // ToDo status indicators.
    const todoStatus = {
        true: <span className="badge badge-success p-1">{ get(languageData, ["common", "done"]) }</span>,
        false: <span className="badge badge-warning p-1">{ get(languageData, ["common", "incomplete"]) }</span>
    }

    // Display ToDo items for the current user if there are any. Otherwise, return nothing.
    // The default text is handled by the API service.
    const todoInfo = get(results, "data")
        ?   map(results.data.content, (result, key) => (
                <Col key={ key } className="mb-3">
                    { todoStatus[result.done] }&nbsp;
                    <b>
                        <Link to={ `${ links.todo.list }${ result._id }` } title={ result.name } className="primary-link">
                            { result.name }
                        </Link>
                    </b>
                    <br />
                    { result.description }
                </Col>
            ))
        : null;

    // Return the formatted result, with error and loading indication.
    return <PageData
                isLoading={ isLoading }
                results={ results }
                hasError={ hasError }
                component={ todoInfo }
            />;
}

// Export the Todo List Page Data Component.
export default TodoPageData;