/**
 * Language Reducer
 *
 * Creates a Redux reducer for handling language actions.
 */

// Action Types
import { SET_LANGUAGE } from "../actionTypes";

// Language Data
import common_en from "../../data/language/en/common.json";

// Setup initial state with the English language.
const initialState = {
    locale: "en",
    languageData: {
        common: common_en
    }
};

// Export the Language Reducer.
export default (state = initialState, action) => {
    switch (action.type) {
        case SET_LANGUAGE: {
            const { locale, languageData } = action.payload;

            return {
                ...state,
                locale,
                languageData
            };
        }
        default:
            return state;
    }
}
