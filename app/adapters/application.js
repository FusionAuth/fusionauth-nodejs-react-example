// import Ember from 'ember';
import JSONAPIAdapter from 'ember-data/adapters/json-api';

export default JSONAPIAdapter.extend({
  // sessionId: Ember.inject.service('sessionId'),
  host: 'http://10.0.1.13:8080',
  namespace: 'api'
});
