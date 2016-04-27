import Ember from 'ember';

var todos = [];

export default Ember.Route.extend({
  model() {
    // if logged in?
    return todos;
    // else redirect?
  }
});
