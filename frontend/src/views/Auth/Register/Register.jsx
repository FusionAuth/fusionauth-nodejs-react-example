// Dependencies
import React, { useState } from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Alert,
    Button,
    Card,
    CardBody,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    FormFeedback,
    Row,
    Col
} from "reactstrap";

/**
 * Register View
 *
 * Handle the registration view and the functions necessary to perform
 * registration and error checking.
 *
 * @TODO cleanup code, add comments.
 */
const Register = () => {
    const [formInputs, setFormInputs] = useState({});
    const [formAlert] = useState({ type: null });

    const handleChange = ({ target }) => {
        setFormInputs({ ...formInputs, [target.name]: { ...formInputs[target.name], value: target.value } });
    }

    const onBlur = ({ target }) => {
        if (target.value.length < 10) {
            setFormInputs({ ...formInputs, [target.name]: { ...formInputs[target.name], error: true, errorText: "Name too short" } });
        } else {
            setFormInputs({ ...formInputs, [target.name]: { ...formInputs[target.name], error: false, errorText: "", validText: "Wooo" } });
        }
    }

    const checkValidProp = input => {
        if (!formInputs[input]) {
            return classNames();
        } else {
            if (formInputs[input].error) {
                return classNames("is-invalid");
            } else {
                if (!formInputs[input].error) {
                    return classNames("is-valid");
                }
            }
        }
    }

    const getInputText = (input, type) => {
        if (!formInputs[input]) {
            return null;
        } else {
            if (type === "invalid") {
                return formInputs[input].errorText;
            } else {
                return formInputs[input].validText;
            }
        }
    }

    const handleSubmit = async e => {
        e.preventDefault();
        const formData = {};
        Object.keys(formInputs).map(input => formData[input] = formInputs[input].value);

    }

    return (
        <>
            <Col lg="5" md="7">
                <Card className="bg-secondary shadow border-0">
                    <CardBody className="px-lg-5 py-lg-5">
                        <div className="text-center text-muted mb-4">
                            Sign up
                        </div>
                        { formAlert.type &&
                            <Alert color={ formAlert.type }>
                                { formAlert.message }
                            </Alert>
                        }
                        <Form role="form" onSubmit={ handleSubmit }>
                            <FormGroup className="mb-3">
                                <InputGroup className="input-group-alternative mb-3">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText className="text-primary">
                                            <FontAwesomeIcon icon="user-tie" />
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input placeholder="Username" type="text" name="username" onChange={ handleChange } onBlur={ onBlur } autoFocus />
                                    <FormFeedback valid>{ getInputText("username", "valid") }</FormFeedback>
                                    <FormFeedback invalid="true">{ getInputText("username", "invalid") }</FormFeedback>
                                </InputGroup>
                            </FormGroup>
                            <FormGroup className="mb-3">
                                <InputGroup className="input-group-alternative mb-3">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText className="text-primary">
                                            <FontAwesomeIcon icon="envelope" />
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input placeholder="Email" type="email" name="email" className={ checkValidProp("username") } onChange={ handleChange } onBlur={ onBlur } />
                                </InputGroup>
                            </FormGroup>
                            <FormGroup>
                                <InputGroup className="input-group-alternative">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText className="text-primary">
                                            <FontAwesomeIcon icon="lock" />
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input placeholder="Password" type="password" name="password" className={ checkValidProp("username") } onChange={ handleChange } onBlur={ onBlur } />
                                </InputGroup>
                            </FormGroup>
                            <FormGroup>
                                <InputGroup className="input-group-alternative">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText className="text-primary">
                                            <FontAwesomeIcon icon="lock" />
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input placeholder="Confirm Password" type="password" name="confirmPassword" className={ checkValidProp("username") } onChange={ handleChange } onBlur={ onBlur } />
                                </InputGroup>
                            </FormGroup>
                            <Row className="my-4">
                                <Col xs="12">
                                    <div className="custom-control custom-control-alternative custom-checkbox">
                                        <input
                                            className="custom-control-input"
                                            id="customCheckRegister"
                                            type="checkbox"
                                        />
                                        <label
                                            className="custom-control-label"
                                            htmlFor="customCheckRegister"
                                        >
                                            <span className="text-muted">
                                                I agree with the{ " " }
                                                <a href="#pablo" onClick={ e => e.preventDefault() }>
                                                    Privacy Policy
                                                </a>
                                            </span>
                                        </label>
                                    </div>
                                </Col>
                            </Row>
                            <div className="text-center">
                                <Button className="mt-4" color="primary" type="submit">
                                    Create account
                                </Button>
                            </div>
                        </Form>
                    </CardBody>
                </Card>
            </Col>
        </>
    );
}

// Export the Register View.
export default Register;
