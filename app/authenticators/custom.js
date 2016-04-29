import Ember from 'ember';
import Base from 'simple-auth/authenticators/base';

export default Base.extend({
  restore: function(data) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      if (!Ember.isEmpty(data.session_name)) {
        resolve(data);
      }
      else {
        reject();
      }
    });
  },

  authenticate: function(options) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      Ember.$.ajax({
        type: "POST",
        url: 'http://example.com/api/user/login',
        data: JSON.stringify({
          username: options.identification,
          password: options.password
        })
      }).then(function(response) {
        Ember.run(function() {
          resolve(response);
        });
      }, function(xhr, status, error) {
        Ember.run(function() {
          reject(xhr.responseJSON || xhr.responseText);
        });
      });
    });
  },

  invalidate: function() {
    console.log('invalidate...');

    return new Ember.RSVP.Promise(function(resolve, reject) {
      Ember.$.ajax({
        type: "POST",
        url: 'http://example.com/api/user/logout',
      }).then(function(response) {
        Ember.run(function() {
          resolve(response);
        });
      }, function(xhr, status, error) {
        Ember.run(function() {
          reject(xhr.responseJSON || xhr.responseText);
        });
      });
    });
  },
});
