/**
 * History Utility
 *
 * This creates a representation of the history of the application
 * that can be utilized throughout the different components without the need
 * to pass the history property from the route (App -> Dashboard -> new component)
 * to each component.
 */

// Dependencies
import { createBrowserHistory } from "history";

// Export the history module.
export default createBrowserHistory();