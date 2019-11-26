// Export the ToDo API.
export default {
    apiService: {
        getTodos: {
            PATH_SEARCH: "/api/todo",
            PATH_METHOD: "get"
        },
        addTodo: {
            PATH_SEARCH: "/api/todo",
            PATH_METHOD: "post"
        },
        editTodo: {
            PATH_SEARCH: "/api/todo",
            PATH_METHOD: "put"
        },
        getTodo: {
            PATH_SEARCH: "/api/todo/one",
            PATH_METHOD: "get"
        },
        deleteTodo: {
            PATH_SEARCH: "/api/todo",
            PATH_METHOD: "delete"
        }
    }
};