import React, { Component } from 'react';
import ToDo from './ToDo';

class ToDoList extends Component {
  render() {
    return (
      <div className="todo-list" key="todo-list">
        {this.props.todos.map(this.renderToDo)}
      </div>
    );
  }

  renderToDo(text) {
    // TODO Use the ToDo identifier from the db for the key.
    return <ToDo key={text} text={text} />;
  }
}

export default ToDoList;
