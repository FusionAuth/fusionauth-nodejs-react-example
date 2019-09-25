/**
 * Input Component
 *
 * References the different types of inputs available in order to display
 * them properly.
 */

// Dependencies
import React from "react";

// Components
import InputCheckbox from "./InputCheckbox";
//import InputFile from "./InputFile";
import InputText from "./InputText";

// Available types of inputs
const availableInputs = {
  checkbox: InputCheckbox,
  //file: InputFile,
  text: InputText
};

/**
 * Input Component
 *
 * Custom input component that displays the proper custom elements if they
 * exist and are defined above.
 *
 * @param {Object} props Properties from the parent function.
 */
const Input = props => {
    // Get the right value for the input based on its type.
    const inputValue = props.type === "checkbox" || props.type === "toggle"
        ? props.value || false
        : props.value || "";

    // Determine if the Custom input should be displayed, or the InputDNE.
    const Input = availableInputs[props.type] ? availableInputs[props.type] : availableInputs["text"];

    // Return the Custom Input.
    return <Input { ...props } value={ inputValue } />;
}

// Export the Custom Input component.
export default Input;