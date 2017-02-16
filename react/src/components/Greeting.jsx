import React, { Component } from 'react';
import { Link } from 'react-router';
import auth from '../auth';

class Greeting extends Component {
  render() {
    return (
      <div className="greeting">
        <span>{auth.loggedIn() ? (localStorage.name) : ('')}</span>
        <div className="logout">
          {auth.loggedIn() ? (<Link to="/logout">Logout</Link>) : ('')}
        </div>
      </div>
    );
  }
}

export default Greeting;
