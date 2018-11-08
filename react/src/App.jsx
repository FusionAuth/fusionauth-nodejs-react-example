import React, { Component } from 'react';
import bluemix_logo from './assets/img/bluemix_logo.svg';
import fusionauth_logo from './assets/img/fusionauth_logo.svg';
import auth from './auth';
import Greeting from './components/Greeting';

import './assets/App.css';
import './assets/Form.css';
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
          <img src={fusionauth_logo} className="App-logo" alt="logo" />
          <h2>IBM Cloud ToDos</h2>
        </div>
        <div className="App-content">
          <Greeting />
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

}

export default App;
