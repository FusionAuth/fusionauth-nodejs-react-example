import React, { Component } from 'react';
import ToDo from './ToDo';

class ToDoList extends Component {
  constructor(props) {
    super(props);
    this.renderToDo = this.renderToDo.bind(this);
  }

  render() {
    return (
      <div className="todo-list" key="todo-list">
        <ToDo refresh={this.props.refresh} template={true} />
        {this.props.todos.map(this.renderToDo)}
      </div>
    );
  }

  renderToDo(todo) {
    return <ToDo key={todo.id} todo={todo} refresh={this.props.refresh}/>;
  }
}

export default ToDoList;
