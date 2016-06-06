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
  model(params) {
    this.set('changeVerificationId', params.changeVerification_id);
  },
  setupController: function(controller, model) {
    controller.set('changeVerificationId', this.get('changeVerificationId'));
    this._super(controller, model);
  },
  actions: {
    error() {
      return this.transitionTo('login');
    },
    submit() {
      var self = this;
      var errors = {};
      var password = this.controller.get('password');
      var confirm_password = this.controller.get('confirm_password');
      var verificationId = this.controller.get('changeVerificationId');

      // Check for required fields
      if (!password) {
        // errors['password'] = 'Required';
      } else if (password !== confirm_password) {
        // Validate passwords match
        errors['password'] = 'Passwords do not match';
        errors['password_confirm'] = 'Passwords do not match';
      }

      if (Object.keys(errors).length === 0) {
        Ember.$.post('/api/change-password/' + verificationId, {password: password})
          .done(() => {
            this.controllerFor('login').set('info', {passwordChanged: true});
            self.transitionTo('login');
          })
          .fail((response) => {
            if (response.status === 404) {
              errors = errorHandler.generalError('[badChangeVerificationId]');
            } else if (response.responseText) {
              errors = errorHandler.handleErrors(JSON.parse(response.responseText));
            } else {
              errors = errorHandler.generalError('[unexpectedError]');
            }
            self.controller.set('errors', errors);
          });
      } else {
        self.controller.set('errors', errors);
      }
    }
  }
});
