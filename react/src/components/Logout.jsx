import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router';

import auth from '../auth';
import '../assets/Logout.css';

class Logout extends Component {
  componentDidMount() {
    auth.logout();
    browserHistory.push('/');
  }
  
  render() {
    return (
      <div className="message">
        You've been successfully logged out. Thank you for using FusionAuth!
        Click here to return to <Link to="/login">Login</Link>
      </div>
    );
  }
}

export default Logout;
