// Dependencies
import React from "react";
import { isFunction } from "lodash";
import { Col, FormGroup, InputGroup, FormFeedback, Input, FormText } from "reactstrap";

// Components
import InputLabel from "./InputLabel";
import InputAddon from "./InputAddon";
import InputError from "./InputError";

// Utils
import ValidateInput from "../../../util/ValidateInput";

/**
 * Input Text Component
 *
 * Custom input text component that displays the input and related components for
 * the input depending on the information supplied. Text is used for all inputs,
 * excluding file and checkbox.
 *
 * @param {Object} props Properties from the parent function.
 */
const InputText = props => {
    // Properties for the input display.
    const {
        inputColXL,
        inputColMD,
        inputColClassName,
        id,
        type,
        autoFocus,
        disabled,
        inputClassName,
        label,
        labelClassName,
        labelMuted,
        name,
        value,
        rows,
        placeholder,
        autoComplete,
        validate,
        secondValue,
        onChange,
        handleFormSubmit,
        onFocus,
        tabIndex,
        prependIcon,
        appendIcon,
        success,
        error,
        formHelpText,
        pattern,
        maxLength
    } = props;

    /**
     * Handle input validation
     *
     * Validate inputs on blur.
     *
     * @param {Object} target The input that fired the event.
     */
    const handleValidate = ({ target }) => {
        validate(target.name, ValidateInput(target.value, target.type, props.validation, props.languageData, secondValue));
    };

    /**
     * Handle Key Press
     *
     * Handles key presses for the input. Work around for some inputs that
     * try to refresh the page for an unknown reason. Instead of allowing the
     * page to be refreshed, it attempts to submit the form.
     *
     * @param {Object} e Input object that executed the function.
     */
    const handleKeyPress = e => {
        e.key === "Enter" && isFunction(handleFormSubmit) && handleFormSubmit(e);
    };

    // Display the input and related content.
    return (
        <Col xl={ inputColXL } md={ inputColMD } className={ inputColClassName }>
            <InputLabel htmlFor={ id } label={ label } className={ labelClassName } labelMuted={ labelMuted } />
            <FormGroup>
                <InputGroup className="input-group-alternative">
                    <InputAddon type="prepend" icon={ prependIcon } />
                    { /* Temporary fix for preventing the form arbitrarily submitting when it shouldn't */ }
                    { /* Handled by onKeyPress */ }
                    <Input
                        autoFocus={ autoFocus }
                        id={ id }
                        name={ name }
                        type={ type }
                        autoComplete={ autoComplete }
                        value={ value }
                        rows={ rows }
                        placeholder={ placeholder }
                        className={ inputClassName }
                        disabled={ disabled }
                        onBlur={ isFunction(validate) ? handleValidate : null }
                        onChange={ onChange }
                        onFocus={ onFocus }
                        tabIndex={ tabIndex }
                        pattern={ pattern }
                        onKeyPress={ handleKeyPress }
                        maxLength={ maxLength }
                    />
                    <InputAddon type="append" icon={ appendIcon } />
                    <FormFeedback valid>{ success }</FormFeedback>
                    <InputError errors={ error } />
                </InputGroup>
                <FormText>{ formHelpText }</FormText>
            </FormGroup>
        </Col>
    );
}

// Export the Custom Input Text component.
export default InputText;
