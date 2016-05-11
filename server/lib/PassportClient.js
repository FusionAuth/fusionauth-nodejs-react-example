var RestClient = require("./RESTClient.js");

PassportClient = function (apiKey, host) {
  this.apiKey = apiKey;
  this.host = host;
  this.client = new RestClient.RESTClient();
  this.client.authorization(this.apiKey).setUrl(this.host);
};

PassportClient.constructor = PassportClient;

PassportClient.prototype = {
  login: function (request, responseHandler) {
    this.client.uri("/api/login").setBody(request).post().go(responseHandler);
  },
  register: function (request, responseHandler) {
    this.client.uri("/api/user/registration").setBody(request).post().go(responseHandler);
  },
  verifyEmail: function (verificationId, responseHandler) {
    this.client.uri("/api/user/verify-email").urlSegment(verificationId).post().go(responseHandler);
  }
};
module.exports.PassportClient = PassportClient;
