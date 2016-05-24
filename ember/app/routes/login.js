/*
 * Copyright (c) 2016, Inversoft Inc., All Rights Reserved
 *
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
 */

import Ember from "ember";
import errorHandler from "../lib/errors";

export default Ember.Route.extend({
  actions: {

    // Handle login action, call /api/login
    login() {
      var self = this;
      // Build the JSON login request body
      var loginRequest = {
        email: this.controller.get("email"),
        password: this.controller.get("password")
      };

      Ember.$.post("/api/login", loginRequest)
        .done(() => {
          this.controllerFor("application").set("loggedIn", true);
          return self.transitionTo("index");
        })
        .fail((xhr) => {
          if (xhr.status === 404) {
            self.controller.set("errors", {"general": "Invalid login credentials."});
          } else if (xhr.status === 412) {
            // Email not verified. User needs to check their inbox or resend the verification.
            // TODO Need message to the user.
            self.controller.set("errors", {"email": "Email not verified. Check your Inbox."});
          } else {
            if (xhr.responseText !== "") {
              var errors = errorHandler.handleErrors(JSON.parse(xhr.responseText));
              self.controller.set("errors", errors);
            }
          }
        });
    },

    // Handle register action, redirect to register
    register: function() {
      var self = this;
      return self.transitionTo("register");
    }
  }
});
