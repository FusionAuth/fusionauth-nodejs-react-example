// Dependencies
import React from "react";
import { Button } from "reactstrap";

/**
 * Custom Button Component
 *
 * @param {String} color Button color
 * @param {String} text Button text
 * @param {String} type Button type
 * @param {Boolean} disabled Button disabled status
 * @param {String} className Button classes
 * @param {Function} onClick onClick function handler
 *
 */
const CustomButton = ({ color, text, type, disabled, className, onClick }) => (
    <Button color={ color } onClick={ onClick } className={ className } type={ type } disabled={ disabled }>
        { text }
    </Button>
);

// Export the Custom Button component.
export default CustomButton;