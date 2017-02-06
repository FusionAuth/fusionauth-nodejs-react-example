import React, { Component } from 'react';
import Register from './Register';
import '../assets/Login.css';

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
    this._authenticate();
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
  
  _authenticate() {
    var formData = new FormData();
    formData.append('loginId', this.state.loginId);
    formData.append('password', this.state.password);
    formData.append('grant_type', 'password');
    formData.append('client_id', '4ed5eb32-0a97-40eb-a6d7-cca1f9fa3a0c')
    
    var request = new Request('http://frontend.local/oauth2/token',
      {
        method: 'POST',
        mode: 'cors',
        body: formData
      }
    );
    
    fetch(request).then((function(response) {
      if (response.status === 200) {
        response.json().then((function(json) {
          localStorage.access_token = json.access_token;
          this.props.setAuthenticated(true);
        }).bind(this));
      } else {
        console.info(response.status);
        if (response.status === 400) {
          response.json().then((json) => {
            console.info(JSON.stringify(json, null, 2));
          })
        }
      }
    }).bind(this));
  }
}

export default Login;
