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

var request = require("supertest");
var should = require("should");
var express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");
var chai = require("chai");
var assert = chai.assert;
var passport = require("../controllers/passport.js");
var todo = require("../controllers/todo.js");

describe("Testing Todo", function() {
  var app = express();
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(bodyParser.json({type: "application/vnd.api+json"}));
  app.use(session({
    secret: "my-secret",
    name: 'sessionId',
    cookie: {
      maxAge: 3600 * 1000
    }
  }));
  app.use("/api/", [passport, todo]);

  var agent = request(app);
  var Cookies;

  it("should get 401 on retrieve", (done) => {
    agent.get("/api/todos")
      .end((err, res) => {
        assert.equal(401, res.status);
        assert.equal(JSON.stringify({
          "errors": [{
            "code": "[notLoggedIn]"
          }]
        }), res.text);
        done();
      });
  });

  it("should get 401 on create", (done) => {
    agent.post("/api/todos")
      .end((err, res) => {
        assert.equal(401, res.status);
        assert.equal(JSON.stringify({
          "errors": [{
            "code": "[notLoggedIn]"
          }]
        }), res.text);
        done();
      });
  });

  it("should get 401 on update", (done) => {
    agent.put("/api/todos")
      .end((err, res) => {
        assert.equal(401, res.status);
        assert.equal(JSON.stringify({
          "errors": [{
            "code": "[notLoggedIn]"
          }]
        }), res.text);
        done();
      });
  });

  it("should get 401 on delete", (done) => {
    agent.delete("/api/todos")
      .end((err, res) => {
        assert.equal(401, res.status);
        assert.equal(JSON.stringify({
          "errors": [{
            "code": "[notLoggedIn]"
          }]
        }), res.text);
        done();
      });
  });

  it("should not get 401 on passport routes", (done) => {
    agent.post("/api/register/")
      .end((err, res) => {
        assert.notEqual(401, res.status);
        done();
      });
  });

  it("should login", (done) => {
    agent.post("/api/login")
      .send({"email": "admin@inversoft.com", "password": "password"})
      .end((err, res) => {
        Cookies = res.headers['set-cookie'].pop().split(';')[0];
        assert.equal(200, res.status);
        _getTodo({data: []}, {completed: false});
        _getTodo({data: []}, {completed: true});
        done();
      });
  });

  var toDelete = "";
  it("should create a todo", (done) => {
    var req = agent.post("/api/todos")
      .send({"data" : { "attributes" :{"text": "testing post"}}});
    req.cookies = Cookies;
    req.end((err, res) => {
      assert.equal(200, res.status);
      assert.equal(JSON.stringify({
        "data": {
          "type": "todo",
          "id": res.body.data.id,
          "attributes": {
            "text": "testing post",
            "completed": false
          }
        }
      }), res.text);
      toDelete = res.body.data.id;
      _getTodo({
        "data": [{
          "type": "todo",
          "id": res.body.data.id,
          "attributes": {
            "text": "testing post",
            "completed": false
          }
        }]
      }, {completed: false});
      done();
    });
  });

  it("should update the todo", (done) => {
    var req = agent.patch("/api/todos/" + toDelete)
      .send({"data" : { "attributes" :{"text": "testing put"}}});
    req.cookies = Cookies;
    req.end((err, res) => {
      assert.equal(204, res.status);
      _getTodo({
        "data": [{
          "type": "todo",
          "id": toDelete,
          "attributes": {
            "text": "testing put",
            "completed": false
          }
        }]
      }, {completed: false});
      done();
    });
  });

  it("should complete the todo", (done) => {
    var req = agent.patch("/api/todos/" + toDelete)
      .send({"data" : { "attributes" :{"completed": true}}});
    req.cookies = Cookies;
    req.end((err, res) => {
      assert.equal(204, res.status);
      _getTodo({
        "data": [{
          "type": "todo",
          "id": toDelete,
          "attributes": {
            "text": "testing put",
            "completed": true
          }
        }]
      }, {completed: true});
      _getTodo({data: []}, {completed: false});
      done();
    });
  });

  it("should delete the todo", (done) => {
    var req = agent.delete("/api/todos/" + toDelete);
    req.cookies = Cookies;
    req.end((err, res) => {
      assert.equal(204, res.status);
      _getTodo({data: []}, {completed: false});
      _getTodo({data: []}, {completed: true});
      done();
    });
  });

  it("should logout", (done) => {
    agent.get("/api/logout")
      .end((err, res) => {
        assert.equal(204, res.status);
        Cookies = null;
        done();
      });
  });

  //helper function
  function _getTodo(todo, query) {
    it("should find the todo", (done) => {
      var req = agent.get("/api/todos")
        .query(query);
      req.cookies = Cookies;
      req.end((err, res) => {
        assert.equal(200, res.status);
        assert.equal(JSON.stringify(todo), res.text);
        done();
      });
    });
  };
});
