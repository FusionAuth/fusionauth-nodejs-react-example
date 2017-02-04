import React, { Component } from 'react';
import './assets/Login.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      applicationId: props.applicationId
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this._authenticate();
  }
  
  render() {
    return (
      <div>
        <div className="Login">
          <form id="login" onSubmit={this.handleSubmit}>
            <label>
              <input id="loginId" name="loginId" type="text" autoFocus placeholder="Email or Username" spellCheck="false" autoCorrect="off" autoComplete="off" onChange={this.handleChange}/>
            </label>
            <label>
              <input id="password" name="password" type="password" placeholder="Password" onChange={this.handleChange}/>
            </label>
            <input type="submit" value="Login" className="submit button"/>
          </form>
        </div>
      </div>
    );
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
    
    fetch(request).then(function(response) {
      if (response.status === 200) {
        response.json().then(function(json) {
          localStorage.access_token = json.access_token;
        })
      } else {
        console.info(response);
      }
    });
  }
}

export default Login;
