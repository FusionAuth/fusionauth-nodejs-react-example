import Ember from "ember";

export default Ember.Route.extend({
  model() {
    return this.store.findAll('todo');
  },
  actions: {
    error() {
      return this.transitionTo('login');
    }
  },
  post() {
    this.store.createRecord('todo', {
      task: this.get('task'),
      completed: false
    });
  }
});
