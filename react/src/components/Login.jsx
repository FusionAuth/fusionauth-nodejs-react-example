import React, { Component } from 'react';
import Register from './Register';
import '../assets/Login.css';
import auth from '../auth';
import { browserHistory } from 'react-router';


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      applicationId: props.applicationId,
      userRegistered: true
    }

    this._handleChange = this._handleChange.bind(this);
    this._handleLoginClick = this._handleLoginClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this.setRegistered = this.setRegistered.bind(this);
  }

  _handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  
  _handleLoginClick(event) {
    event.preventDefault();
    this.setRegistered(false);
  }

  _handleFormSubmit(event) {
    event.preventDefault();
    auth.login(this.state.loginId, this.state.password, (authenticated) => {
      // If authenticated, not registered, go to registration, else go to /
//      this.props.setAuthenticated(true);
      this.setRegistered(authenticated);
      browserHistory.push('/');
    });
  }
  
  render() {
    return (
     <div>
      {this.state.userRegistered ? (
         <div className="Login" ref={(login) => {this.loginForm = login; }} >
          <form id="login" onSubmit={this._handleFormSubmit}>
            <label>
              <input id="loginId" name="loginId" type="text" autoFocus placeholder="Email or Username" spellCheck="false" autoCorrect="off" autoComplete="off" onChange={this._handleChange}/>
            </label>
            <label>
              <input id="password" name="password" type="password" placeholder="Password" onChange={this._handleChange}/>
            </label>
            <input type="submit" value="Login" className="submit button"/>
            Not registered yet? <a href="#" className="register-form" onClick={this._handleLoginClick}>Sign up here.</a>
          </form>
        </div>
       ) : (
         <Register setRegistered={ this.setRegistered }/>
       )}
      </div>
    );
  }
  
  setRegistered(registered) {
    this.setState({
      userRegistered: registered
    });
  }
}

export default Login;
