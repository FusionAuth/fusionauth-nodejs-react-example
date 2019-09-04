// Dependencies
import React from "react";
import { Button } from "reactstrap";

/**
 * Custom Button Component
 *
 * @param {String} color Button color
 * @param {String} text Button text
 * @param {Function} onClick onClick function handler
 *
 */
const CustomButton = ({ color, text, onClick }) => (
    <Button color={ color } onClick={ onClick }>
        { text }
    </Button>
);

// Export the Custom Button component.
export default CustomButton;