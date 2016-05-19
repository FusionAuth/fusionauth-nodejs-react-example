ClientResponse = function (statusCode) {
  this.statusCode = statusCode;
  this.errorResponse = null;
  this.successResponse = null;
  this.exception = null;
};

ClientResponse.constructor = ClientResponse;

ClientResponse.prototype = {
  wasSuccessful: function () {
    return this.statusCode >= 200 && this.statusCode <= 299 && this.exception === null;
  }
};

module.exports.ClientResponse = ClientResponse;
