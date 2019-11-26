/**
 * Language Module
 *
 * This module will get language data for the API endpoints.
 */

// Declare the language module.
const language = {};

/**
 * Get text from the language files
 *
 * Get the proper text for a given language. English is
 * the default language.
 */
language.getText = lang => {
    // Setup the return object.
    let langData = {};

    // Return data for the appropriate language.
    switch (lang) {
        case "es":
            langData = require("../../data/language/es");
            break;
        default:
            langData = require("../../data/language/en");
    }

    // Return the language data for the selected language.
    return langData;
}

// Export the language module.
module.exports = language;