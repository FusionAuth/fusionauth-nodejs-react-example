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

'use strict';

/**
 * Model a user object.
 *
 * @param {Object} user The user.
 * @constructor
 */
var User = function(user) {
  this.id = user.id;
  this.email = user.email;
  this.registrations = user.registrations;
  this.username = user.username;
};

User.constructor = User;
User.prototype = {

  /**
   * Check if the user has the specified role.
   *
   * @param {string} applicationId The application id.
   * @param {string} role The requested role.
   * @returns {boolean} True if the user has the role.
   */
  hasRole: function(applicationId, role) {
    if (this.registrations == undefined) {
      return false;
    }
    var userRegistration = null;

    for (var i = 0; i < this.registrations.length; i++) {
      if (this.registrations[i].applicationId === applicationId) {
        userRegistration = this.registrations[i];
        break;
      }
    }

    if (userRegistration === null) {
      return false;
    }

    return userRegistration.roles.indexOf(role) !== -1;
  }
};

module.exports = User;
