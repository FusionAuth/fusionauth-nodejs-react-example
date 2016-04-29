

import Ember from 'ember';
import Base from 'simple-auth/authorizers/base';

export default Base.extend({
  authorize: function(jqXHR, requestOptions) {
    requestOptions.contentType = 'application/json;charset=utf-8';
    requestOptions.crossDomain = true;
    requestOptions.xhrFields = {
      withCredentials: true
    };

    var token = this.get('session.token');
    if (this.get('session.isAuthenticated') && !Ember.isEmpty(token)) {
      jqXHR.setRequestHeader('X-CSRF-Token', token);
    }
  }
});
