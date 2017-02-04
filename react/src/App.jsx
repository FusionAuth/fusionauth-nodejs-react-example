import React, { Component } from 'react';
import bluemix_logo from './assets/img/bluemix_logo.svg';
import passport_logo from './assets/img/passport_logo.png';
import ToDoListContainer from './components/containers/ToDoListContainer';
import Login from './Login';

import './assets/App.css';
import './assets/Login.css';
import './assets/index.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accessToken: localStorage.getItem('access_token'),
      authenticated: false            
    };
  }
  
  componentWillMount() {
    if (this.state.accessToken !== null) {
      this._validateAccessToken();
    }
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
          {this.state.authenticated ? (
            <ToDoListContainer />
          ) : (
            <Login />
          )}
        </div>
      </div>
    );
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
      this.setState({
        authenticated: true
      });
      response.json().then((function(json) {
        this.setState({
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
