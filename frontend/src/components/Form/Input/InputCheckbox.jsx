// Dependencies
import React from "react";
import { isFunction } from "lodash";
import { Col, FormGroup, FormFeedback, Input, FormText } from "reactstrap";

// Components
import InputLabel from "./InputLabel";
import InputError from "./InputError";

// Utils
import ValidateInput from "../../../util/ValidateInput";

/**
 * Input Checkbox Component
 *
 * Custom input checkbox component that displays the input and related components for
 * the input depending on the information supplied.
 *
 * @param {Object} props Properties from the parent function.
 */
const InputCheckbox = props => {
    // Properties for the input display.
    const {
        inputColXL,
        inputColMD,
        inputColClassName,
        id,
        autoFocus,
        disabled,
        formGroupClassName,
        inputClassName,
        inputCheckboxClassName,
        inputStyle,
        label,
        labelClassName,
        labelMuted,
        name,
        validate,
        onFocus,
        onChange,
        tabIndex,
        value,
        success,
        error,
        formHelpText,
    } = props;

    /**
     * Handle input validation
     *
     * Validate inputs on blur.
     *
     * @param {Object} target The input that fired the event.
     */
    const handleValidate = ({ target }) => {
        validate(target.name, ValidateInput(value, target.type, props.validation, props.languageData));
    };

    // Display the input and related content.
    return (
        <Col xl={ inputColXL } md={ inputColMD } className={ inputColClassName }>
            <FormGroup className={ formGroupClassName }>
                <Input
                    id={ id }
                    name={ name }
                    type="checkbox"
                    autoFocus={ autoFocus }
                    className={ `${ inputClassName } ${ inputCheckboxClassName }` }
                    disabled={ disabled }
                    onBlur={ isFunction(validate) ? handleValidate : null}
                    onChange={ onChange }
                    onFocus={ onFocus }
                    style={ inputStyle }
                    tabIndex={ tabIndex }
                    checked={ value ? "checked" : "" }
                />
                <InputLabel htmlFor={ id } label={ label } className={ labelClassName } labelMuted={ labelMuted } />
                <FormFeedback valid>{ success }</FormFeedback>
                <InputError errors={ error } />
                <FormText>{ formHelpText }</FormText>
            </FormGroup>
        </Col>
    );
}

// Export the Custom Input Checkbox component.
export default InputCheckbox;
