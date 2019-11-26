/**
 * User Reducer
 *
 * Creates a Redux reducer for handling user actions.
 */

// Action Types
import { SET_USER, LOGOUT_USER } from "../actionTypes";

// Setup initial state with an empty user info object.
const initialState = {
    info: null
};

// Export the User Reducer.
export default (state = initialState, action) => {
    switch (action.type) {
        case SET_USER: {
            const { info } = action.payload;

            return {
                info
            };
        }
        case LOGOUT_USER: {
            return {
                info: null
            };
        }
        default:
            return state;
    }
}
