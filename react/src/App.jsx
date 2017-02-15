import React, { Component } from 'react';
import { Link } from 'react-router';
import bluemix_logo from './assets/img/bluemix_logo.svg';
import passport_logo from './assets/img/passport_logo.png';
import auth from './auth';

import './assets/App.css';
import './assets/Login.css';
import './assets/index.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: auth.loggedIn()
    };

    this.setAuthenticated = this.setAuthenticated.bind(this);
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={bluemix_logo} className="App-logo" alt="logo" />
          <img src={passport_logo} className="App-logo" alt="logo" />
          <h2>Get started with Passport</h2>
        </div>
        <div className="App-content">
          <div className="logout">
            {auth.loggedIn() ? (<Link to="/logout">Logout</Link>) : ('')}
          </div>
          {this.props.children}
        </div>
      </div>
    );
  }

  setAuthenticated(authenticated) {
    if (!authenticated) {
      localStorage.removeItem('access_token');
    }
    console.info('set authenticated [' + authenticated + ']');
    this.setState({
      authenticated: authenticated
    });
  }

  _validateAccessToken() {
    fetch(new Request('http://passport.local/api/jwt/validate',
      {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Authorization': 'JWT ' + this.state.accessToken
        }
      }
    ))
    .then(this._validateHandler.bind(this));
  }

  _validateHandler(response) {
    if (response.status === 200) {
      response.json().then((function(json) {
        this.setState({
          authenticated: true,
          accessToken: json.token
        });
        localStorage.access_token = json.token;
      }).bind(this));
    } else {
      console.info(response);
    }
  }
}

export default App;
