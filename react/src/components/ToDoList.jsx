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

  renderToDo(todo) {
    return <ToDo key={todo.id} completed={todo.attributes.completed} text={todo.attributes.text} />;
  }
}

export default ToDoList;
