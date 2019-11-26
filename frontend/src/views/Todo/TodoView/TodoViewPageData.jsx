// Dependencies
import React from "react";
import { get, map } from "lodash";
import { Col } from "reactstrap";
import { Link } from "react-router-dom";

// Components
import PageData from "../../../components/Util/PageData";
import CustomButton from "../../../components/CustomButton";

// Config
import { links } from "../../../config";

/**
 * ToDo Item Data Component
 *
 * Display the ToDo item of a given ID properly.
 *
 * @param {Boolean} isLoading Loading indication for API request.
 * @param {Object} results Result object from the API request.
 * @param {Object} hasError Error object from the API request.
 * @param {Object} languageData Current language information for the app. Language data object.
 */
const TodoPageData = ({ isLoading, results, hasError, languageData }) => {
    // Names of the field we want to display and the value of the header for the field.
    const fieldNames = {
        _id: get(languageData, ["common", "todo", "fields", "_id"]),
        name: get(languageData, ["common", "todo", "fields", "name"]),
        description: get(languageData, ["common", "todo", "fields", "description"]),
        done: get(languageData, ["common", "todo", "fields", "done"]),
        updatedAt: get(languageData, ["common", "updatedAt"]),
        createdAt: get(languageData, ["common", "createdAt"])
    }

    // ToDo status indicators.
    const todoStatus = {
        true: <span className="badge badge-success p-2">{ get(languageData, ["common", "done"]) }</span>,
        false: <span className="badge badge-warning p-2">{ get(languageData, ["common", "incomplete"]) }</span>
    }

    // Display the ToDo item for the current user with the given ID if it exists.
    const todoInfo = get(results, ["data", "content"])
        ?   <>
                { map(results.data.content, (result, key) => (
                    fieldNames.hasOwnProperty(key) &&
                        <Col xl="12" md="12" className="mb-3" key={ key }>
                            <b>{ fieldNames[key] }</b><br />
                            { key === "done" ? todoStatus[result] : result }
                        </Col>
                ))}

                <Col className="text-center">
                    <Link to={ links.todo.list }>
                        <CustomButton color="info" text={ get(languageData, ["common", "returnList"]) } className="mr-2" />
                    </Link>
                </Col>
            </>
        : null;

    // Return the formatted result, with error and loading indication.
    return <PageData
                isLoading={ isLoading }
                results={ results }
                hasError={ hasError }
                component={ todoInfo }
            />;
}

// Export the ToDo Item Data Component.
export default TodoPageData;