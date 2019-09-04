/**
 * Toast Utility
 *
 * Contains the information about the "react-toastify" package and maintains
 * the ability to create toasts utilizing that package. These toasts are helpful
 * for displaying temporary information to users.
 */

// Dependencies
import { toast } from "react-toastify";

// Declare the Toasty Utility.
const Toasty = {};

/**
 * Toast Notify
 *
 * Create a toast notification with the information supplied, or the defaults
 * specified below. This is used for creating useful temporary notifications where
 * you may not want to "permanently" display something on the screen, like the "Alert"
 * from bootstrap / reactstrap.
 */
Toasty.notify = ({ type, content, position, autoClose }) => {
    // Create a toast.
    toast(content, {
        position: position || "top-right",
        type: type || Toasty.info(),
        autoClose: autoClose || 3000
    });
};

/**
 * Toast Default
 *
 * Returns the Toast default type.
 */
Toasty.default = () => {
    return toast.TYPE.DEFAULT;
};

/**
 * Toast Info
 *
 * Returns the Toast info type.
 */
Toasty.info = () => {
    return toast.TYPE.INFO;
};

/**
 * Toast Success
 *
 * Returns the Toast success type.
 */
Toasty.success = () => {
    return toast.TYPE.SUCCESS;
};

/**
 * Toast Warning
 *
 * Returns the Toast warning type.
 */
Toasty.warning = () => {
    return toast.TYPE.WARNING;
};

/**
 * Toast Error
 *
 * Returns the Toast error type.
 */
Toasty.error = () => {
    return toast.TYPE.ERROR;
};

// Export the Toasty Utility.
export default Toasty;