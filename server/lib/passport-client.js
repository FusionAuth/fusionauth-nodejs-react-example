var RESTClient = require("./RESTClient.js");

PassportClient = function(apiKey, host) {
  this.apiKey = apiKey;
  this.host = host;
};

PassportClient.constructor = PassportClient;

PassportClient.prototype = {
  /**
   * Creates the given application.
   *
   * @param {String} id (Optional) The id of the new application.
   * @param {*} request The application creation request.
   * @return {Promise} A Promise for the Passport call.
   */
  createApplication: function(id, request) {
    return new Promise((resolve, reject) => {
      this._start().uri("/api/application").urlSegment(id).setBody(request).post().go(this._promiseHandler(resolve, reject));
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
      this._start().uri("/api/user").urlSegment(userId).urlParameter("hardDelete", true).delete().go(this._promiseHandler(resolve, reject));
    });
  },

  /**
   * Logs a user in.
   *
   * @param request contains the user credentials to log in.
   * @return {Promise} A Promise for the Passport call.
   */
  login: function(request) {
    return new Promise((resolve, reject) => {
      this._start().uri("/api/login").setBody(request).post().go(this._promiseHandler(resolve, reject));
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
      this._start().uri("/api/user/registration").urlSegment(userId).setBody(request).post().go(this._promiseHandler(resolve, reject));
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
      this._start().uri("/api/user/verify-email").urlParameter("email", email).put().go(this._promiseHandler(resolve, reject));
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
      this._start().uri("/api/application/").urlSegment(id).get().go(this._promiseHandler(resolve, reject));
    });
  },

  /**
   * Retrieves the SystemConfiguration.
   *
   * @returns {Promise} A Promise for the Passport call.
   */
  retrieveSystemConfiguration: function() {
    return new Promise((resolve, reject) => {
      this._start().uri("/api/system-configuration").get().go(this._promiseHandler(resolve, reject));
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
      this._start().uri("/api/system-configuration").setBody(request).put().go(this._promiseHandler(resolve, reject));
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
      this._start().uri("/api/user/verify-email").urlSegment(verificationId).post().go(this._promiseHandler(resolve, reject));
    });
  },

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
  _promiseHandler: function(resolve, reject) {
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
