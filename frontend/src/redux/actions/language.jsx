/**
 * Language Actions
 *
 * Action creators for Language based actions.
 */

// Dependencies
import { get } from "lodash";

// Language
import Language from "../../util/Language";

// Toasty
import Toasty from "../../util/Toasty";

// Action Types
import { SET_LANGUAGE } from "../actionTypes";

/**
 * Set the App Language
 *
 * Performs a dispatch to the Redux store with the new language and
 * the language data. If a new language cannot be found, alert the user.
 * There's a very small percent chance that no HTML element would be clicked
 * that does not have the `data-lang` attribute.
 *
 * @param {Object} target The HTML element that
 */
const setLanguage = ({ target }) => (dispatch, getState) => {
    // Get the language attribute from the button and the span item.
    // With this setup, it's done this way so that either could be clicked.
    // If not, clicking on the text in the dropdown would result in an error.
    const newLanguage = target.getAttribute("data-lang");

    // Make sure the language supplied to the function is not null / empty.
    if (!newLanguage) {
        // Get the language data.
        const languageData = getState("language").language.languageData;

        // Display a toast notification that the language was empty.
        Toasty.notify({
            type: Toasty.error(),
            content: get(languageData, ["common", "changeLang", "choose"])
        });

        return;
    }

    // Get the language data for the new language.
    const languageData = Language.getLanguageData(newLanguage);

    // Dispatch the result.
    dispatch({
        type: SET_LANGUAGE,
        payload: {
            locale: newLanguage,
            languageData
        }
    });
}

// Export the actions.
export {
    setLanguage
}