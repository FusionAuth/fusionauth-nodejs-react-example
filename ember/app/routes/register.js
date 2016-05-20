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
    register() {
      var self = this;
      //Get all the field data
      var email = this.controller.get("email");
      var password = this.controller.get("password");
      var confirm_password = this.controller.get("confirm_password");
      var first_name = this.controller.get("first_name");
      var last_name = this.controller.get("last_name");

      var errors = {};
      var flag = true;

      //Check to see if first name is filled out
      if (!first_name) {
        errors["first_name"] = "Required";
        flag = false;
      }
      //Check to see if last name is filled out
      if (!last_name) {
        errors["last_name"] = "Required";
        flag = false;
      }

      //Check to see if the passwords match
      if (password !== confirm_password) {
        errors["password"] = "Passwords do not match";
        errors["password_confirm"] = "Passwords do not match";
        flag = false;
      }
      if (flag) {
        Ember.$.post("/api/register", {
          "email": email,
          "password": password,
          "firstName": first_name,
          "lastName": last_name
        }).fail((err) => {
          errors = errorHandler.handleErrors(JSON.parse(err.responseText));
          self.controller.set("errors", errors);
        }).done(()=> {
          //TODO notify user to check email
          return self.transitionTo("login");
        });
      } else {
        self.controller.set("errors", errors);
      }
    },
    back() {
      this.transitionTo("login");
    }
  }
});
