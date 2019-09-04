// Dependencies
import React from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Container,
    Row,
    Col
} from "reactstrap";

// Config
import { config, links } from "../../config";

// API
import APIFetch from "../../util/APIFetch";
import TodoAPI from "./TodoAPI";

// Components
import CustomButton from "../../components/CustomButton";

// Page Data
import TodoPageData from "./TodoPageData";

// History
import History from "../../util/History";

/**
 * Todo View
 *
 * The Todo view contains information for all of the user's Todo list items. From here,
 * they are able to edit, view, and delete the individual Todo items.
 */
const Todo = () => {
    // Setup the API Fetch utility for the Todo View.
    const [{ isLoading, results, hasError }] = APIFetch({
        BASEURL: config.apiServer.BASEURL,
        PATH_SEARCH: TodoAPI.apiService.getTodos.PATH_SEARCH,
        PATH_METHOD: TodoAPI.apiService.getTodos.PATH_METHOD
    });

    const goToAddTodo = () => {
        // Redirect the user to the add Todo page.
        History.push(links.todo.add);
    }

    // Render the Todo View.
    return (
        <Container className="mt-5">
            <Row className="mt-5 justify-content-center">
                <Col xl="6" md="12" className="mt-5 mx-auto">
                    <Card className="bg-primary-card">
                        <CardHeader className="d-flex align-items-center">
                            My Todos

                            <span className="ml-auto">
                                <CustomButton color="warning" text="Add" onClick={ goToAddTodo } />
                            </span>
                        </CardHeader>
                        <CardBody className="mx-auto">
                            <Row>
                                <TodoPageData
                                    isLoading={ isLoading }
                                    results={ results }
                                    hasError={ hasError } />
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

// Export the Todo View.
export default Todo;
