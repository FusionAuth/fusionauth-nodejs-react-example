import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';

import '../assets/ToDo.css';

const config = require("../../config/config.js");

class ToDo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      todo: this.props.todo || {},
      completed: this.props.todo ? this.props.todo.attributes.completed : false,
      value: this.props.todo ? this.props.todo.attributes.text : '',
      edit: !this.props.todo,
      template: this.props.template || false
    };

    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
    this._handleAddClick = this._handleAddClick.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleKeyUp = this._handleKeyUp.bind(this);
    this._handleSaveClick = this._handleSaveClick.bind(this);
  }

  _handleAddClick(event) {
    event.preventDefault();
    if (this.state.value.length > 1) {
      this.create(() => {
        this.setState({
          value: ''
        });
        this.props.refresh();
      });
    }
  }

  _handleChange(event) {
    this.setState({
      value: event.target.value
    });
  }

  _handleDeleteClick(event) {
    event.preventDefault();
    this.delete(() => {
      this.props.refresh();
    });
  }

  _handleEditClick(event) {
    event.preventDefault();
    this.setState({
      edit: true
    })
  }

  _handleKeyUp(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      // Capture 'Enter' and save changes
      // Update the TODO
      if (this.state.template) {
        if (this.state.value.length > 1) {
          this.create(() => {
            this.setState({
              value: ''
            });
            this.props.refresh();
          });
        }
      } else {
        this.update(() => {
          this.setState({
            edit: false
          });
        });
      }

    } else if (event.keyCode === 27) {
      // Capture 'ESC' - Cancel the edit and roll back an changes
      event.preventDefault();

      this.setState({
        value: this.props.todo.attributes.text,
        edit: false
      });

    }
  }

  _handleSaveClick(event) {
    event.preventDefault();
    this.update();

    const todo = this.state.todo;
    todo.attributes.text = this.state.value;
    this.setState({
      edit: false,
      todo: todo
    });
  }

  _renderText() {
    return (
      <div className="text">
        {this.state.edit ? (
            <input type="text" placeholder="Add a Todo" autoFocus="autofocus" value={this.state.value} onChange={this._handleChange} onKeyUp={this._handleKeyUp}/>
          ) : (
            <span>{this.state.value}</span>
          )}
      </div>
    );
  }

  _renderLeftActions() {
    return (
    <div className="action check">
      <FontAwesome name="square-o" />
    </div>
    );
  }

  _renderRightActions() {
    if (this.state.template) {
      return (
        <div className="action add" onClick={this._handleAddClick}>
          <span aria-hidden="true" className="fa"/>
          <FontAwesome name="plus" />
        </div>
      );
    } else if (this.state.edit) {
      return (
        <div>
          <div className="action save" onClick={this._handleSaveClick}>
            <span aria-hidden="true" className="fa"/>
          </div>
          <div className="action delete" onClick={this._handleDeleteClick}>
            <span aria-hidden="true" className="fa"/>
          </div>
        </div>
      );
    } else {
      return (
        <div className="action edit" onClick={this._handleEditClick}>
          <span aria-hidden="true" className="fa"/>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="todo flex-child" data-template={this.state.template}>
        {this._renderLeftActions()}
        {this._renderText()}
        {this._renderRightActions()}
      </div>
    );
  }

  create(callBack) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status < 200 || xhr.status > 299) {
          if (xhr.status === 400) {
            console.info(JSON.stringify(xhr.responseText, null, 2));
          } else {
            console.info('fail [' + xhr.status + ']');
          }
        } else {
          if (callBack) {
            callBack();
          }
        }
      }
    };

    xhr.open('POST', config.todo.url + '/api/todos', true);
    xhr.setRequestHeader('Authorization', 'JWT ' + localStorage.access_token);
    xhr.setRequestHeader("Content-type","application/json");

    const data = {'attributes': { 'text': this.state.value}};
    const jsonRequest = JSON.stringify({'data': data});
    xhr.send(jsonRequest);
  }

  delete(callBack) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status < 200 || xhr.status > 299) {
          if (xhr.status === 400) {
            console.info(JSON.stringify(xhr.responseText, null, 2));
          } else {
            console.info('fail [' + xhr.status + ']');
          }
        } else {
          if (callBack) {
            callBack();
          }
        }
      }
    };

    xhr.open('DELETE', config.todo.url + '/api/todos/' + this.state.todo.id, true);
    xhr.setRequestHeader('Authorization', 'JWT ' + localStorage.access_token);
    xhr.send();
  }

  update(callBack) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status < 200 || xhr.status > 299) {
          if (xhr.status === 400) {
            console.info(JSON.stringify(xhr.responseText, null, 2));
          } else {
            console.info('fail [' + xhr.status + ']');
          }
        } else {
          if (callBack) {
            callBack();
          }
        }
      }
    };

    xhr.open('PUT', config.todo.url + '/api/todos/' + this.state.todo.id, true);
    xhr.setRequestHeader('Authorization', 'JWT ' + localStorage.access_token);
    xhr.setRequestHeader("Content-type","application/json");

    const data = this.state.todo;
    data.attributes.text = this.state.value;
    const jsonRequest = JSON.stringify({'data': data});
    xhr.send(jsonRequest);
  }
}

export default ToDo;
