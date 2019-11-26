/**
 * Root Reducer
 *
 * Creates a Redux root reducer for handling all reducer actions in the
 * application.
 */

// Dependencies
import { combineReducers } from "redux";

// Reducers
import language from "./languageReducer";
import user from "./userReducer";

// Export the Redux reducer.
export default combineReducers({
    language,
    user
});