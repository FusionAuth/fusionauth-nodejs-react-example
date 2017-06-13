import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router';

import Errors from './Errors';
import auth from '../auth';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      applicationId: props.applicationId,
      errors: []
    };

    this._handleChange = this._handleChange.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
  }

  _handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  _handleFormSubmit(event) {
    event.preventDefault();
    auth.login(this.state.loginId, this.state.password, (status, response) => {
      if (status === 200) {
        // This will change if you call the /oauth2/token endpoint instead of the /api/login
        //   /oauth2/token
        //      --> response.access_token
        //      --> respponse.userId
        //
        //  /api/login
        //      --> response.token
        //      --> response.user.id
        localStorage.access_token = response.token;
        localStorage.userId = response.user.id;
        browserHistory.push('/');
      } else if (status === 202) {
        this.setState({
          'errors': ['[AuthenticatedNotRegistered]']
        })
      } else if (status === 409) {
        this.setState({
          'errors': ['[AccountLocked]']
        })
      } else {
        this.setState({
          'errors': response
        })
      }
    });
  }

  render() {
    return (
       <div className="login" >
        <Errors errors={this.state.errors} />
        <form id="login" onSubmit={this._handleFormSubmit}>
          <label>
            <input id="loginId" name="loginId" type="text" autoFocus placeholder="Email or Username" spellCheck="false" autoCorrect="off" autoComplete="off" onChange={this._handleChange}/>
          </label>
          <label>
            <input id="password" name="password" type="password" placeholder="Password" onChange={this._handleChange}/>
          </label>
          <input type="submit" value="Login" className="submit button"/>
          Not registered yet? <Link to="/register">Sign up here.</Link>
        </form>
      </div>
    );
  }
}

export default Login;
