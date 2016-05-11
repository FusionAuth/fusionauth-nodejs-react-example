var http = require("http");
var https = require("https");
var myResponse = require("./ClientResponse.js");

RESTClient = function () {
  this.headers = {};
  this.parameters = null;
  this.restUrl = null;
  this.body = null;
  this.certificate = null;
  this.connectTimeout = 2000;
  this.key = null;
  this.method = null;
  this.readTimeout = 2000;
  this.uriPath = null;
};

RESTClient.constructor = RESTClient;

RESTClient.prototype = {
  authorization: function (key) {
    this.header("Authorization", key);
    return this;
  },
  basicAuthorization: function (username, password) {
    if (username && password) {
      var cred = username + ":" + password;
      this.header("Authorization", "Basic " + window.btoa(cred));
    }
    return this;
  },
  setBody: function (body) {
    this.body = JSON.stringify(body);
    this.header("Content-Type", "application/json");
    this.header("Content-Length", this.body.length);
    return this;
  },
  setCertificate: function (certificate) {
    this.certificate = certificate;
    return this;
  },
  setConnectTimeout: function (connectTimeout) {
    this.connectTimeout = connectTimeout;
    return this;
  },
  delete: function () {
    this.method = "DELETE";
    return this;
  },
  get: function () {
    this.method = "GET";
    return this;
  },
  post: function () {
    this.method = "POST";
    return this;
  },
  put: function () {
    this.method = "PUT";
    return this;
  },
  go: function (responseHandler) {
    var uri = this.restUrl.split(':');
    var myHttp = uri[0] === "https" ? https : http;
    var options = {
      hostname: uri[1].split("//")[1] !== null ? uri[1].split("//")[1] : "127.0.0.1",
      port: uri[2] !== null ? uri[2] : "80",
      path: this.uriPath,
      method: this.method,
      headers: this.headers
    };

    var clientResponse = new myResponse.ClientResponse(null, null);
    myHttp.request(options, function (response) {
      clientResponse.statusCode = response.statusCode;
      response.on("data", function (data) {
        var json = JSON.parse(data);
        if (clientResponse.wasSuccessful()) {
          clientResponse.successResponse = json;
        } else {
          clientResponse.errorResponse = json;
        }
      }).on("error", function (error) {
        var json = JSON.parse(error);
        clientResponse.exception = json;
      }).on("exception", function (error) {
        var json = JSON.parse(error);
        clientResponse.exception = json;
      }).on("end", function () {
        responseHandler(clientResponse);
      });
    }).on("error", function (error) {
      clientResponse.statusCode = 500;
      clientResponse.exception = error;
      responseHandler(clientResponse);
    }).end(this.body);
  },
  header: function (key, value) {
    this.headers[key] = value;
    return this;
  },
  setHeaders: function (headers) {
    this.headers = headers;
    return this;
  },
  setKey: function (key) {
    this.key = key;
    return this;
  },
  setReadTimeout: function (readTimeout) {
    this.readTimeout = readTimeout;
    return this;
  },
  uri: function (uri) {
    this.uriPath = uri;
    return this;
  },
  setUrl: function (url) {
    this.restUrl = url;
    return this;
  },
  urlParamater: function (name, value) {
    if (value) {
      var values = this.parameters[name];
      if (values === undefined) {
        this.parameters[name] = [];
      }
      this.parameters[name].push(value);
    }
    return this;
  },
  urlSegment: function (segment) {
    if (segment) {
      if (this.restUrl.charAt(this.restUrl.length - 1) !== "/") {
        this.restUrl = this.restUrl + "/";
      }
      this.restUrl = this.restUrl + segment;
    }
    return this;
  }
};


module.exports.RESTClient = RESTClient;
