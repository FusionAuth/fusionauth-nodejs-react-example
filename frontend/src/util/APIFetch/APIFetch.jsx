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

/**
 * API Fetch Utility
 *
 * A clean utility for making calls to different API endpoints across the application.
 * It can be used to retrieve results or errors from attempting API requests.
 *
 * @TODO cleanup per page & current page
 *
 * @param {string} BASEURL Base url for API requests.
 * @param {string} PATH_SEARCH API path to request.
 * @param {string} PATH_METHOD Method for API requests (ex get, post, put, delete).
 * @param {string} PATH_QUERY Query to be sent along with the the API request.
 * @param {number} PATH_PERPAGE Limit the number of results per page.
 * @param {object} formData Form data to be sent with the API request.
 * @param {object} initialData Initial data for the calling component.
 */
const APIFetch = ({ BASEURL, PATH_SEARCH, PATH_METHOD, PATH_QUERY = "", PATH_PERPAGE = "", formData = null, initialData = null }) => {
    // Setup initial state
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState(initialData);
    const [hasError, setError] = useState(null);
    const [query, setQuery] = useState(PATH_QUERY);
    const [perPage, setPerPage] = useState(PATH_PERPAGE);

    /**
     * Set API request result
     *
     * Set the result to the response object from the API request.
     *
     * @param {object} result Result object from the API request.
     */
    const setAPIResults = async result => {
        // Set the result state to the result object.
        await setResults(result);
        // Set the loading state to false.
        await setIsLoading(false);
    }

    /**
     * Fetch results from the API
     *
     * Function performs the request to the provided API. Can be called manually,
     * but it is also called when state changes in useEffect which can be used to
     * load data when the page first loads.
     *
     * @param {object} formData Form data to be sent with the API request.
     * @param {number} searchPerPage Limit the number of results per page.
     * @param {number} page Current page for the request.
     */
    const fetchResults = async (formData, searchPerPage = 0, page = 0) => {
        // Set the error state to null.
        await setError(null);
        // Set loading to true.
        await setIsLoading(true);

        // If the previous per page state is not equal to the new one, then
        // set the per page state to the new one.
        if (searchPerPage !== perPage) {
            setPerPage(searchPerPage)
        }

        /**
         * Fetch a response from an API
         *
         * Returns a promise after making a request to an API endpoint.
         */
        return new Promise(async (resolve, reject) => {
            await axios({
                url: `${ BASEURL }${ PATH_SEARCH }${ query }`,
                method: PATH_METHOD,
                data: formData,
                withCredentials: true
            }).then(async result => {
                // Make a function call to set the result from the API request.
                await setAPIResults(result);
                // Return from the promise with the result from the API request.
                resolve(result);
            }).catch(async ({ response }) => {
                // Set the error state to the error from the API request.
                await setError(response);
                // Return from the promise with the error from the API request.
                reject(response);
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
        const fetchData = async () => {
            if (!didCancel) {
                // If the method is post, we want to make sure we have formData for the request.
                if ((PATH_METHOD !== "post") || ((PATH_METHOD === "post") && (formData))) {
                    // Fetch the API results. Catch the error to handle the promise.
                    await fetchResults(perPage, formData)
                        .catch(() => null);
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