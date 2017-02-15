import React, { Component } from 'react';
import { Link } from 'react-router';
import Errors from './Errors';

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
    console.info(this.state.errors);
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
    this._register();
  }
  
  _register() {
    var registrationRequest = {
      user: {
        email: this.state.email,
        password: this.state.password
      },
      registration: {
        applicationId: '4ed5eb32-0a97-40eb-a6d7-cca1f9fa3a0c'
      },
      skipVerification: true
    };
    
    var request = new Request('http://passport.local/api/user/registration',
      {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(registrationRequest),
        headers: {
          'Authorization': '1cfd3949-a5db-4f3c-a936-b18519ecd0c2',
          'Content-Type': 'application/json'
        }
      }
    );
    
    fetch(request).then((function(response) {
      if (response.status === 200) {
        response.json().then((function(json) {
          this.props.setRegistered(true);
        }).bind(this));
      } else {
        console.info(response.status);
        if (response.status === 400) {
          response.json().then((json) => {
            console.info(JSON.stringify(json, null, 2));
            if (json.generalErrors && json.generalErrors.length > 0) {
             this.setState({
              'errors': [json.generalErrors[0].message]
             });              
            } else {
              this.setState({
              'errors': [json.fieldErrors['user.email'][0].code]
              });  
             }
          });
        }
      }
    }).bind(this));
  }
  
}

export default Register;
