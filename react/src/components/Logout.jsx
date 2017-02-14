import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { Link } from 'react-router';

import auth from '../auth';
import '../assets/Logout.css';

class Logout extends Component {
  handleClick(event) {
    event.preventDefault();
    auth.logout();
    browserHistory.push('/');
  }

  render() {
    return (
      <div className="logout">
        {auth.loggedIn() ? (<Link to="/logout" onClick={this.handleClick}>Logout</Link>) : ('')}
      </div>
    );
  }
}

export default Logout;
