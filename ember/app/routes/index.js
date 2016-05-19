import Ember from "ember";

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
      completed: this.store.query('todo', {completed: true}),
      todos: this.store.findAll('todo')
    });
  },
  actions: {
    error(errors) {
      console.log(errors);
      return this.transitionTo('login');
    },
    completeTodo(todo){
      Ember.$.ajax({
        url: "/api/todos/" + todo.get('id') + "?completed=true",
        type: "PUT"
      }).then(function(response) {
        if(response.errors){

        }
        return todo.set('complated', true);
      });
    },
    createTodo() {
      var todo = this.store.createRecord("todo", {
        text: text,
        completed: false
      });
      return todo.save();
      // var route = this;
      // var task = this.controller.get('task');
      // Ember.$.post('/api/todos', {
      //   "task": task
      // }, function (response) {
      //   if (response.errors) {
      //     console.log(response.errors);
      //   } else {
      //     return route.store.createRecord('todo', {
      //       id: response.data.id,
      //       task: task,
      //       completed: false
      //     });
      //   }
      // });
    },
    deleteTodo(todo) {
      todo.deleteRecord();
      todo.save().then(function() {
        console.log('Save OK.');
      }).catch((err) => {
        console.log('Save failed.');
      });
    },
    updateTodo(todo) {
      var task = todo.get('task');
      Ember.$.ajax({
        url: "/api/todos/" + todo.get('id'),
        type: "PUT",
        dataType: "json",
        data: {
          task: task
        }
      }).then(function(response) {
        if(response.errors){

        }
        return todo.set('task', task);
      });
    }
  }
});
