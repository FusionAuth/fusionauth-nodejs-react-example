import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router';
import Errors from './Errors';
import auth from '../auth';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: []
    };

    this._handleChange = this._handleChange.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
  }

  render() {
    return (
      <div className="register">
        <Errors errors={this.state.errors} />
        <form id="register" onSubmit={this._handleFormSubmit}>
          <label>
            <input id="firstName" name="firstName" type="text" autoFocus placeholder="First Name" spellCheck="false" autoCorrect="off" autoComplete="off" onChange={this._handleChange}/>
          </label>
          <label>
            <input id="lastName" name="lastName" type="text" autoFocus placeholder="Last Name" spellCheck="false" autoCorrect="off" autoComplete="off" onChange={this._handleChange}/>
          </label>
          <label>
            <input id="email" name="email" type="text" autoFocus placeholder="Email" spellCheck="false" autoCorrect="off" autoComplete="off" onChange={this._handleChange}/>
          </label>
          <label>
            <input id="password" name="password" type="password" placeholder="Password" onChange={this._handleChange}/>
          </label>
          <label>
            <input id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm Password" onChange={this._handleChange}/>
          </label>
          <input type="submit" value="Register" className="submit button"/>
          Already registered? <Link to="/login">Sign in here.</Link>
        </form>
      </div>
    )
  }

  _handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  _handleFormSubmit(event) {
    event.preventDefault();
    if (this.state.password !== this.state.confirmPassword) {
      this.setState({
        errors: ['[PasswordMismatch]']
      });
      return;
    }
    auth.register(this.state.email, this.state.password, this.state.firstName, this.state.lastName, (status, errors) => {
      if (status >= 200 && status <= 299) {
        browserHistory.push('/');
      } else if (status === 400) {
        this.setState({
          errors: errors
        })
      } else {
        console.error('fail.');
      }
    });
  }

}

export default Register;
