import React, {Component} from 'react';
import ToDoList from '../ToDoList';
import { browserHistory } from 'react-router';

const configuration = require("../../config/config.js");

class ToDoListContainer extends Component {
  constructor() {
    super();
    this.state = { todos: [] };

    this.load = this.load.bind(this);
  }

  componentDidMount() {
    this.load();
  }

  load() {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = (function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          this.setState({
            todos: response.todos
          });
        } else if (xhr.status === 400) {
          console.info(JSON.stringify(xhr.responseText, null, 2));
        } else if (xhr.status === 401 || xhr.status === 403) {
          // JWT is likely expired, force the user to log in again.
          browserHistory.push('/logout');
        }
      }
    }).bind(this);

    configuration(function(config) {
      xhr.open('GET', config.todo.url + '/api/todos?userId=' + localStorage.userId, true);
      xhr.setRequestHeader('Authorization', 'JWT ' + localStorage.access_token);
      xhr.send();
    });

  }

  render() {
    return <ToDoList todos={this.state.todos} refresh={this.load}/>;
  }
}

export default ToDoListContainer;
