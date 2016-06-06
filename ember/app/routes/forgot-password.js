/*
 * Copyright (c) 2016, Inversoft Inc., All Rights Reserved
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 *
 */

import Ember from 'ember';
import errorHandler from '../lib/errors';

export default Ember.Route.extend({
  actions: {
    error() {
      return this.transitionTo('login');
    },
    back() {
      var self = this;
      self.controller.send('clearForm');
      self.transitionTo('login');
    },
    submit() {
      var self = this;
      Ember.$.post('/api/forgot-password', {email: this.controller.get('email')})
        .done(() => {
          this.controllerFor('login').send('clearPassword');
          this.controllerFor('login').set('info', {resetRequestSent: true});
          self.transitionTo('login');
        })
        .fail((err) => {
          var errors = {};
          if (err.status === 404) {
            // Don't indicate this was a bad email, behave as though it is valid.
            this.controllerFor('login').set('info', {resetRequestSent: true});
            self.transitionTo('login');
          } else if (err.responseText) {
            errors = errorHandler.handleErrors(JSON.parse(err.responseText));
          } else {
            errors = errorHandler.generalError('[unexpectedError]');
          }
          self.controller.set('errors', errors);
        });
    }
  }
});
