import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('todo');
  },
  actions: {
    error(error, transition) {
      if (error) {
        return this.transitionTo('login');
      } else {
        console.log(transition);
        return true;
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
