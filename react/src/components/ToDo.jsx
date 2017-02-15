import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';

import '../assets/ToDo.css';

class ToDo extends Component {
  constructor(props) {
    super(props);

    this.state = {value: this.props.text};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      value: event.target.value
    });
  }

  render() {
    return (
      <div className="todo flex-child">
        <div className="action">
          <FontAwesome name="square-o" />
        </div>
        <div className="text">
          <input type="text" value={this.state.value} onChange={this.handleChange}/>
        </div>
        <div className="action">
          <span aria-hidden="true" className="fa"></span>
        </div>
      </div>
    );
  }
}

export default ToDo;
