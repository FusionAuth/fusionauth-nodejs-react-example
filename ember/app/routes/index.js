import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    console.log("getting todos");
    return this.store.findAll('todo');
  },
  actions: {
    error(error, transition) {
      if (error) {
        console.log("redirecting to login");
        return this.transitionTo('login');
      }
    }
  },
  post() {
    this.store.createRecord('todo', {
      task: this.get('task'),
      completed: false
    });
  }
});
