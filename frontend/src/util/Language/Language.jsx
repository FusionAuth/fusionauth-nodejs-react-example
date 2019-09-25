/**
 * Language Module
 *
 * Contains function related to language methods for the application. Handles
 * getting the language data for the preferred language.
 */

// Languages
import common_en from "../../data/language/en/common.json";
import common_es from "../../data/language/es/common.json";

// Declare the Language Module object.
const Language = {};

/**
 * Get application language data
 *
 * Gets the application's language data based on the preferred language of the user.
 * This will be English by default.
 *
 * @param {String} preferredLanguage Preferred language for application
 */
Language.getLanguageData = preferredLanguage => {
    // Set an object that we'll fill in with the switch statement.
    let langData;

    // Check the preferred language against available languages. Default to English.
    switch (preferredLanguage) {
        case "es":
            langData = {
                common: common_es
            };
            break;
        default:
            langData = {
                common: common_en
            };
    }

    // Return the language data for the application.
    return langData;
}

// Export the Language Module.
export default Language;