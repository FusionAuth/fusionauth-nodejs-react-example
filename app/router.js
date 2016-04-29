import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('login');
  this.resource('events', function() {
    this.route('show', { path: '/:event_id'});
  });
});

export default Router;
