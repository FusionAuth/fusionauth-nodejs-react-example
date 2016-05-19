import Ember from "ember";

export default Ember.Route.extend({
  model() {
    return this.store.query("todo", {completed: true});
  },
  actions: {
    error() {
      return this.transitionTo("login");
    },
    completeTodo(todo){
      todo.set("completed", false);
      todo.save().then(() => {
        return this.store.unloadRecord(todo);
      });
    },
    deleteTodo(todo) {
      return todo.destroyRecord();
    },
    updateTodo(todo) {
      return todo.save();
    }
  }
});
