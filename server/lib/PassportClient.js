var RestClient = require("./RESTClient.js");

PassportClient = function (apiKey, host) {
  this.apiKey = apiKey;
  this.host = host;
};

PassportClient.constructor = PassportClient;

PassportClient.prototype = {
  /**
   * Logs a user in.
   * @param request contains the user credentials to log in.
   * @param responseHandler function that handles the response from Passport.
   */
  login: function (request, responseHandler) {
    this.start().uri("/api/login").setBody(request).post().go(responseHandler);
  },
  /**
   * Registers a user.
   * @param request contains the user information to register a user with Passport.
   * @param responseHandler function that handles the response from Passport.
   */
  register: function (request, responseHandler) {
    this.start().uri("/api/user/registration").setBody(request).post().go(responseHandler);
  },
  /**
   * Verifies the email of a user so they can log in.
   * @param verificationId the uuid sent to a user in an email.
   * @param responseHandler responseHandler function that handles the response from Passport.
   */
  verifyEmail: function (verificationId, responseHandler) {
    this.start().uri("/api/user/verify-email").urlSegment(verificationId).post().go(responseHandler);
  },
  /**
   * creates a rest client
   * @returns {*|RESTClient}
   */
  start: function () {
    var client = new RestClient.RESTClient();
    client.authorization(this.apiKey).setUrl(this.host);
    return client;
  }
};
module.exports.PassportClient = PassportClient;
