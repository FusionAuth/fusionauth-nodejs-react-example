var http = require("http");
var https = require("https");
var url = require("url");
var queryString = require("querystring");
var myResponse = require("./client-response.js");

/**
 * RESTful WebService call builder. This provides the ability to call RESTful WebServices using a builder pattern to
 * set up all the necessary request information and parse the response.
 *
 * @author Derek Klatt
 * @constructor
 */
RESTClient = function () {
  this.headers = {};
  this.parameters = null;
  this.restUrl = null;
  this.body = null;
  this.certificate = null;
  this.key = null;
  this.method = null;
};

RESTClient.constructor = RESTClient;

RESTClient.prototype = {
  /**
   * Sets the authorization header using a key
   * @param key String
   * @returns {RESTClient}
   */
  authorization: function (key) {
    this.header("Authorization", key);
    return this;
  },
  /**
   * Sets the authorization header using username and password
   * @param username String
   * @param password String
   * @returns {RESTClient}
   */
  basicAuthorization: function (username, password) {
    if (username && password) {
      var cred = username + ":" + password;
      this.header("Authorization", "Basic " + window.btoa(cred));
    }
    return this;
  },
  /**
   * Sets the body of the client request.
   * @param body JSON
   * @returns {RESTClient}
   */
  setBody: function (body) {
    this.body = JSON.stringify(body);
    this.header("Content-Type", "application/json");
    this.header("Content-Length", this.body.length);
    return this;
  },
  /**
   * Sets the ssl certificate for request to https endpoints.
   * @param certificate String
   * @returns {RESTClient}
   */
  setCertificate: function (certificate) {
    this.certificate = certificate;
    return this;
  },
  /**
   * Sets the http method to DELETE
   * @returns {RESTClient}
   */
  delete: function () {
    this.method = "DELETE";
    return this;
  },
  /**
   * Sets the http method to GET
   * @returns {RESTClient}
   */
  get: function () {
    this.method = "GET";
    return this;
  },
  /**
   * Sets the http method to POST
   * @returns {RESTClient}
   */
  post: function () {
    this.method = "POST";
    return this;
  },
  /**
   * Sets the http method to PUT
   * @returns {RESTClient}
   */
  put: function () {
    this.method = "PUT";
    return this;
  },
  /**
   * Creates the request to the REST API.  Takes a responseHandler which is a function that handles the response from the REST API.
   * @param responseHandler function
   */
  go: function (responseHandler) {
    if (this.parameters) {
      if (this.restUrl.indexOf('?') === -1) {
        this.restUrl = this.restUrl + '?';
      }
      this.restUrl = this.restUrl + queryString.stringify(this.parameters);
    }
    var scheme = url.parse(this.restUrl);
    var myHttp = scheme.protocol === "https:" ? https : http;

    var port = 443;
    if (scheme.port) {
      port = scheme.port;
    } else if (scheme.protocol == "http:") {
      port = 80;
    }

    var options = {
      hostname: scheme.hostname,
      port: port,
      path: scheme.path,
      method: this.method,
      headers: this.headers
    };

    if (scheme.protocol == "https:") {
      options["key"] = this.key;
      options["cert"] = this.certificate;
    }

    var clientResponse = new myResponse.ClientResponse(null, null);

    var request = myHttp.request(options, function (response) {
      clientResponse.statusCode = response.statusCode;
      response.on("data", function (data) {
        var json = data;
        try {
          json = JSON.parse(data);
        } catch(err){}
        if (clientResponse.wasSuccessful()) {
          clientResponse.successResponse = json;
        } else {
          clientResponse.errorResponse = json;
        }
      }).on("error", function (error) {
        clientResponse.exception = error;
      }).on("exception", function (exception) {
        clientResponse.exception = exception;
      }).on("end", function () {
        responseHandler(clientResponse);
      });
    });
    request.on("error", function (error) {
      clientResponse.statusCode = 500;
      clientResponse.exception = error;
      responseHandler(clientResponse);
    });
    request.end(this.body);
  },
  /**
   * Creates a header field in the format "key" : value
   * @param key String
   * @param value Object
   * @returns {RESTClient}
   */
  header: function (key, value) {
    this.headers[key] = value;
    return this;
  },
  /**
   * Sets the entire header field.
   * @param headers JSON
   * @returns {RESTClient}
   */
  setHeaders: function (headers) {
    this.headers = headers;
    return this;
  },
  /**
   * Sets the ssl key for request to https endpoints.
   * @param key String
   * @returns {RESTClient}
   */
  setKey: function (key) {
    this.key = key;
    return this;
  },
  /**
   * Sets the uri of the REST request
   * @param uri String
   * @returns {RESTClient}
   */
  uri: function (uri) {
    if (typeof this.restUrl === "undefined") {
      return this;
    }

    if (this.restUrl.charAt(this.restUrl.length - 1) === '/' && uri.charAt(0) === '/') {
      this.restUrl = this.restUrl + uri.substring(1);
    } else if (this.restUrl.charAt(this.restUrl.length - 1) !== '/' && uri.charAt(0) !== '/') {
      this.restUrl = this.restUrl + "/" + uri;
    } else {
      this.restUrl = this.restUrl + uri;
    }

    return this;
  },
  /**
   * Sets the host of the REST request.
   * @param url String
   * @returns {RESTClient}
   */
  setUrl: function (url) {
    this.restUrl = url;
    return this;
  },
  /**
   * Adds url parameters to the REST request.
   * @param name String
   * @param value String
   * @returns {RESTClient}
   */
  urlParameter: function (name, value) {
    if (value) {
      if (this.parameters === null) {
        this.parameters = {};
      }
      var values = this.parameters[name];
      if (values === undefined) {
        this.parameters[name] = [];
      }
      if (typeof value === "object") {
        for (var v in value) {
          if (value.hasOwnProperty(v)) {
            this.parameters[name].push(value[v]);
          }
        }
      } else {
        this.parameters[name].push(value);
      }
    }
    return this;
  },
  /**
   * Adds a url path segments to the REST request.
   * @param segment String
   * @returns {RESTClient}
   */
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

module.exports = RESTClient;
