import React, { Component } from 'react';
import ToDoList from '../ToDoList';

class ToDoListContainer extends Component {
  constructor() {
    super();
    this.state = { todos: [] };
  }

  componentDidMount() {
    // Make an API call to retrieve the list of ToDo items
    this.setState({
      todos: ['task1', 'task2', 'task3']
    });
  }

  render() {
    return <ToDoList todos={this.state.todos} />;
  }
}

export default ToDoListContainer;
