var client = require('../../lib/RESTClient.js');
var chai = require("chai");
var http = require("http");

var testServer = http.createServer(function (req, res) {
  var headers = req.headers;
  var uri = req.url;
  var method = req.method;
  var response = {
    headers: headers,
    uri: uri,
    method: method
  };
  res.end(JSON.stringify(response));
});
testServer.listen(3000);
var key = "47ee0a5a-51a7-4cc3-a351-eeade8a02c4a";
var url = "http://127.0.0.1:3000";
var segment = "5876696f-17dc-47bd-a1f3-94140b5677a4";
var uri = "/api/user/";
var body = {"test": "test"};

var restclient = new client.RESTClient();
restclient.authorization(key).setUrl(url);

//Tests urlSegment, urlParameter and get
restclient.uri(uri).urlSegment(segment).urlParameter("foo", ["bar", "baz"]).urlParameter("single", "single").get().go(function (response) {
  var success = response.successResponse;
  var headers = success.headers;
  chai.assert.strictEqual(success.method, "GET");
  chai.assert.strictEqual(success.uri, uri + segment + "?foo=bar&foo=baz&single=single");
  chai.assert.strictEqual(headers.authorization, key);
  chai.assert.isOk(headers.host, url);
});

//Tests setBody and post
restclient.setBody(body).post().go(function (response) {
  var success = response.successResponse;
  var headers = success.headers;
  chai.assert.strictEqual(success.method, "POST");
  chai.assert.strictEqual(headers["content-type"], "application/json");
  chai.assert.equal(headers["content-length"], JSON.stringify(body).length);
});

//Tests put
restclient.put().go(function (response) {
  chai.assert.strictEqual(response.successResponse.method, "PUT");
});

//Tests delete
restclient.delete().go(function (response) {
  chai.assert.strictEqual(response.successResponse.method, "DELETE");
  testServer.close();
});

//Tests handling error on connection
restclient = new client.RESTClient();
restclient.setUrl("http://127.0.0.1:3001");
restclient.get().go(function (response) {
  chai.assert.strictEqual(response.statusCode, 500);
  chai.assert.isNotNull(response.exception, "");
});

