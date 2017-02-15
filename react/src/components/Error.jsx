import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';

class Error extends Component {
  render() {
    return (
       <div className="error">
         <FontAwesome className="error" name="circle-o" />
         {this.props.text}
       </div>
    );
  }
}

export default Error;
