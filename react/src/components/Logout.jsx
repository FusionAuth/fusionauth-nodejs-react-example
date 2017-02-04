import React, { Component } from 'react';
import '../assets/Logout.css';

class Logout extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.setAuthenticated(false);
  }
  
  render() {
    return (
      <div className="logout">
        <button onClick={this.handleClick}>Logout</button>
      </div>
    );
  }
}

export default Logout;
