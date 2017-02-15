import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router';


class Error extends Component {
  
  render() {
    return (
       <div className="error">
        {this.props.text}
       </div>
    );
  }
}

export default Error;
