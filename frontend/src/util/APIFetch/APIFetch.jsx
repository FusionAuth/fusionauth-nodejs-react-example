/**
 * API Fetch Utility
 *
 * This utility is used for API requests for the application. It handles responses and sets
 * error objects as well. API requests can be made on component update, or through an
 * explicit request with the fetchResults function.
 */

// Dependencies
import { useEffect, useState } from "react";
import axios from "axios";
import { isEmpty } from "lodash";

// Config
import { config, links } from "../../config";

// Toasty
import Toasty from "../Toasty";

// History
import History from "../History";


/**
 * API Fetch Utility
 *
 * A clean utility for making calls to different API endpoints across the application.
 * It can be used to retrieve results or errors from attempting API requests.
 *
 * @TODO cleanup per page & current page
 *
 * @param {String} locale The current locale / language for the user.
 * @param {String} BASEURL Base url for API requests.
 * @param {String} PATH_SEARCH API path to request.
 * @param {String} PATH_METHOD Method for API requests (ex get, post, put, delete).
 * @param {String} PATH_QUERY Query to be sent along with the the API request.
 * @param {Number} PATH_PERPAGE Limit the number of results per page.
 * @param {Object} formData Form data to be sent with the API request.
 * @param {Object} initialData Initial data for the calling component.
 */
const APIFetch = ({ locale, BASEURL, PATH_SEARCH, PATH_METHOD, PATH_QUERY = "", PATH_PERPAGE = "", formData = null, initialData = null }) => {
    // Setup initial state
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState(initialData);
    const [hasError, setError] = useState(null);
    const [query, setQuery] = useState(PATH_QUERY);
    const [perPage, setPerPage] = useState(PATH_PERPAGE);

    // Array of methods that require input data.
    const postMethods = ["post", "put"];

    /**
     * Set API request result
     *
     * Set the result to the response object from the API request.
     *
     * @param {Object} result Result object from the API request.
     */
    const setAPIResults = result => {
        // Set the result state to the result object.
        setResults(result);
        // Set the loading state to false.
        setIsLoading(false);
    }

    /**
     * Fetch results from the API
     *
     * Function performs the request to the provided API. Can be called manually,
     * but it is also called when state changes in useEffect which can be used to
     * load data when the page first loads.
     *
     * @param {Object} formData Form data to be sent with the API request.
     * @param {Number} searchPerPage Limit the number of results per page.
     * @param {Number} page Current page for the request.
     */
    const fetchResults = (formData, searchPerPage = 0, page = 0) => {
        // Set the error state to null.
        setError(null);
        // Set loading to true.
        setIsLoading(true);

        // Setup headers for the request.
        let headers = {
            locale
        }

        // If the previous per page state is not equal to the new one, then
        // set the per page state to the new one.
        if (searchPerPage !== perPage) {
            setPerPage(searchPerPage)
        }

        // Change headers to an empty object if the request is to FusionAuth because
        // it will error out if we try to send the language info.
        if (BASEURL === config.fusionAuth.BASEURL){
            headers = {}
        }

        /**
         * Fetch a response from an API
         *
         * Returns a promise after making a request to an API endpoint.
         */
        return new Promise((resolve, reject) => {
            axios({
                url: `${ BASEURL }${ PATH_SEARCH }${ query }`,
                method: PATH_METHOD,
                data: formData,
                withCredentials: true,
                headers
            }).then(result => {
                // Make a function call to set the result from the API request.
                setAPIResults(result);
                // Set loading to false.
                setIsLoading(false);
                // Return from the promise with the result from the API request.
                resolve(result);
            }).catch(({ response }) => {
                // Check if the response requires the user to log in again.
                if (response.data.loginAgain) {
                    // Let the user know they cannot access the page.
                    Toasty.notify({
                        type: Toasty.error(),
                        content: response.data.message
                    });

                    // Send the user to the login page.
                    History.push(links.auth.login);
                } else {
                    // Set the error state to the error from the API request.
                    setError(response);
                    // Set loading to false.
                    setIsLoading(false);
                    // Return from the promise with the error from the API request.
                    reject(response);
                }
            });
        });
    }

    /**
     * Update API results
     *
     * API results are automatically loaded on component load, or are updated when
     * the query is changed. Additionally, API results can be fetched by calling
     * fetchResults.
     */
    useEffect(() => {
        // Set a variable so we can cancel the request if needed (ex, user
        // moves to a new page).
        let didCancel = false;

        /**
         * Make the API request
         *
         * Make the request to the API endpoint, but check for a few things before
         * doing so. We make sure that the user did not navigate to a new page,
         * and that formData is set if the request is POST.
         */
        const fetchData = () => {
            // Check if the query is initialized with an undefined variable.
            if ((query !== "") && (query.includes("undefined"))) {
                return;
            };

            // Make sure we don't try to fetch data after re-render.
            if (!didCancel) {
                // If the method is post, we want to make sure we have formData for the request.
                if (!postMethods.includes(PATH_METHOD) || (postMethods.includes(PATH_METHOD) && formData)) {
                    // Make sure we prevent re-renders when we're using `get` but updating local stage
                    // in a component.
                    if (PATH_METHOD === "get" && isEmpty(formData)) {
                        // Fetch the API results. Catch the error to handle the promise.
                        fetchResults(perPage, formData)
                            .catch(() => null);
                    }
                }
            }
        }

        // Make the call to the fetch function.
        fetchData();

        /**
         * Perform action when the component is unmounted
         *
         * The return function in useEffect is equivalent to componentWillUnmount and
         * can be used to cancel the API request.
         */
        return () => {
            // Set the canceled variable to true.
            didCancel = true;
        };

        // eslint-disable-next-line
    }, [query]);

    // Return the useful data and functions from the API Fetch utility.
    return [{ query, setQuery, perPage, fetchResults, isLoading, results, hasError }];
};

// Export the API Fetch utility.
export default APIFetch;