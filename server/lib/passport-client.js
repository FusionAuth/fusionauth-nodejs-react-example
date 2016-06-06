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

var RESTClient = require("./rest-client.js");

var PassportClient = function(apiKey, host) {
  this.apiKey = apiKey;
  this.host = host;
};

PassportClient.constructor = PassportClient;
PassportClient.prototype = {

  /**
   * Changes a user's password using the verification id. This usually occurs after an email has been sent to the user
   * and they clicked on a link to reset their password.
   * 
   * @param {String} verificationId The uuid sent to a user in an email.
   * @param {*} request The change password request.
   * @return {Promise} A Promise for the Passport call.
   */
  changePassword: function(verificationId, request) {
    return new Promise((resolve, reject) => {
      this._start()
        .uri("/api/user/change-password")
        .urlSegment(verificationId)
        .setBody(request)
        .post()
        .go(this._responseHandler(resolve, reject));
    });
  },

  /**
   * Begins the forgot password sequence, which kicks off an email to the user so that they can reset their password.
   * 
   * @param {*} request The forgot password request.
   * @return {Promise} A Promise for the Passport call.
   */
  forgotPassword: function(request) {
    return new Promise((resolve, reject) => {
      this._start()
        .uri("/api/user/forgot-password")
        .setBody(request)
        .post()
        .go(this._responseHandler(resolve, reject));
    });
  },

  /**
   * Creates the given application.
   *
   * @param {String} id (Optional) The id of the new application.
   * @param {*} request The application creation request.
   * @return {Promise} A Promise for the Passport call.
   */
  createApplication: function(id, request) {
    return new Promise((resolve, reject) => {
      this._start()
        .uri("/api/application")
        .urlSegment(id)
        .setBody(request)
        .post()
        .go(this._responseHandler(resolve, reject));
    });
  },

  /**
   * Deletes a user
   *
   * @param {String} userId The id of the user to be deleted
   * @return {Promise} A Promise for the Passport call.
   */
  deleteUser: function(userId) {
    return new Promise((resolve, reject) => {
      this._start()
        .uri("/api/user")
        .urlSegment(userId)
        .urlParameter("hardDelete", true)
        .delete()
        .go(this._responseHandler(resolve, reject));
    });
  },

  /**
   * Logs a user in.
   *
   * @param request contains the user credentials to log in.
   * @param callerIpAddress (Optional) The IP address of the end-user that is logging in. If a null value is
   *  provided the IP address will be that of the client or last proxy that sent the request.
   * @return {Promise} A Promise for the Passport call.
   */
  login: function(request, callerIpAddress) {
    return new Promise((resolve, reject) => {
      this._start()
        .uri("/api/login")
        .urlParameter("X-Forwarded-For", callerIpAddress)
        .setBody(request)
        .post()
        .go(this._responseHandler(resolve, reject));
    });
  },

  /**
   * Registers a user.
   *
   * @param {String} userId (Optional) The id of the user being registered for the application and optionally created.
   * @param {*} request contains the user information to register a user with Passport.
   * @return {Promise} A Promise for the Passport call.
   */
  register: function(userId, request) {
    return new Promise((resolve, reject) => {
      this._start()
        .uri("/api/user/registration")
        .urlSegment(userId)
        .setBody(request)
        .post()
        .go(this._responseHandler(resolve, reject));
    });
  },

  /**
   * Resends the verification email.
   *
   * @param {String} email the email to resend the verification code
   * @return {Promise} A Promise for the Passport call.
   */
  resendEmail: function(email) {
    return new Promise((resolve, reject) => {
      this._start()
        .uri("/api/user/verify-email")
        .urlParameter("email", email)
        .put()
        .go(this._responseHandler(resolve, reject));
    });
  },

  /**
   * Retrieves the application with the given id.
   *
   * @param {String} id The UUID of the application to retrieve.
   * @returns {Promise} A Promise for the Passport call.
   */
  retrieveApplication: function(id) {
    return new Promise((resolve, reject) => {
      this._start()
        .uri("/api/application/")
        .urlSegment(id)
        .get()
        .go(this._responseHandler(resolve, reject));
    });
  },

  /**
   * Retrieves the SystemConfiguration.
   *
   * @returns {Promise} A Promise for the Passport call.
   */
  retrieveSystemConfiguration: function() {
    return new Promise((resolve, reject) => {
      this._start()
        .uri("/api/system-configuration")
        .get()
        .go(this._responseHandler(resolve, reject));
    });
  },

  /**
   * Updates the system configuration.
   *
   * @param {*} request The request that contains the new SystemConfiguration settings.
   * @returns {Promise} A Promise for the Passport call.
   */
  updateSystemConfiguration: function(request) {
    return new Promise((resolve, reject) => {
      this._start()
        .uri("/api/system-configuration")
        .setBody(request)
        .put()
        .go(this._responseHandler(resolve, reject));
    });
  },

  /**
   * Verifies the email of a user so they can log in.
   *
   * @param {String} verificationId The uuid sent to a user in an email.
   * @return {Promise} A Promise for the Passport call.
   */
  verifyEmail: function(verificationId) {
    return new Promise((resolve, reject) => {
      this._start()
        .uri("/api/user/verify-email")
        .urlSegment(verificationId)
        .post()
        .go(this._responseHandler(resolve, reject));
    });
  },

  /* ===================================================================================================================
   * Private methods
   * ===================================================================================================================*/

  /**
   * creates a rest client
   *
   * @returns {RESTClient} The RESTClient that will be used to call.
   * @private
   */
  _start: function() {
    var client = new RESTClient();
    client.authorization(this.apiKey).setUrl(this.host);
    return client;
  },

  /**
   * Returns a function to handle the promises for each call.
   *
   * @param resolve The promise's resolve function.
   * @param reject The promise's reject function.
   * @returns {Function} The function that will call either the resolve or reject functions based on the ClientResponse.
   * @private
   */
  _responseHandler: function(resolve, reject) {
    return function(response) {
      if (response.wasSuccessful()) {
        resolve(response);
      } else {
        reject(response);
      }
    }
  }
};

module.exports = PassportClient;
