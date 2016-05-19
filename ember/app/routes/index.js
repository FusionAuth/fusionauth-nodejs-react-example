import Ember from "ember";

export default Ember.Route.extend({
  model() {
    return this.store.findAll("todo");
  },
  actions: {
    error() {
      return this.transitionTo("login");
    },
    completeTodo(todo){
      todo.set("completed", true);
      todo.save().then(() => {
        return this.store.unloadRecord(todo);
      });
    },
    createTodo(text) {
      var todo = this.store.createRecord("todo", {
        text: text,
        completed: false
      });
      this.controller.set("text", "");
      return todo.save();
    },
    deleteTodo(todo) {
      return todo.destroyRecord();
    },
    updateTodo(todo) {
      return todo.save();
    }
  }
});
