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

var express = require("express");
var Todo = require("../models/todo.js");
var todo = new Todo();
var config = require("../config/config.js");
var appId = config.passport.applicationId;
var router = express.Router();
var User = require('../lib/user.js');

var fs = require("fs");
// Open file for appending. The file is created if it does not exist.
var logFile = fs.openSync(config.logName, "a");

// Ensure the user is logged in for every request in this route and if they aren't return 401 with an error
router.all("/todos", (req, res, next) => {
  if (req.session === undefined || req.session.user === undefined) {
    res.status(401).send({
      "errors": [{
        "code": "[notLoggedIn]"
      }]
    });
  } else {
    next();
  }
});

router.route("/todos").get((req, res) => {
  if (!_isAuthorized(req, "RETRIEVE_TODO")) {
    _sendUnauthorized(res);
    return;
  }

  todo.retrieveAll(req.session.user.id, "true" === req.query.completed)
    .then((todos) => {
      res.send(_convertTodos(todos));
    })
    .catch((err) => {
      _handleDatabaseError(res, err);
    });
});

router.route("/todos").post((req, res) => {
  if (!_isAuthorized(req, "CREATE_TODO")) {
    _sendUnauthorized(res);
    return;
  }

  todo.create(req.body.data.attributes.text, req.session.user.id)
    .then((todo) => {
      res.send(_convertTodo(todo));
    })
    .catch((err) => {
      _handleDatabaseError(res, err);
    });
});

router.route("/todos/:id").patch((req, res) => {
  if (!_isAuthorized(req, "UPDATE_TODO")) {
    _sendUnauthorized(res);
    return;
  }

  todo.update(req.params.id, req.session.user.id, req.body.data.attributes.text, req.body.data.attributes.completed)
    .then((rowsUpdated) => {
      if (rowsUpdated[0] === 1) {
        res.sendStatus(204);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      _handleDatabaseError(res, err)
    });
});

router.route("/todos/:id").delete((req, res) => {
  if (!_isAuthorized(req, "DELETE_TODO")) {
    _sendUnauthorized(res);
    return;
  }

  todo.delete(req.params.id, req.session.user.id)
    .then((noClue) => {
      res.sendStatus(204);
    })
    .catch(function(err) {
      _handleDatabaseError(res, err);
    });
});

function _convertTodo(todo) {
  var response = {"data": {}};
  response.data = {
    "type": "todo",
    "id": todo.id,
    "attributes": {
      "text": todo.text,
      "completed": todo.completed
    }
  };
  return response;
}

function _convertTodos(todos) {
  var response = {"data": []};
  for (var i = 0; i < todos.length; i++) {
    response.data.push(_convertTodo(todos[i]).data);
  }
  return response;
}

function _handleDatabaseError(res, error) {
  console.error(error);
  //Logging to file
  fs.appendFile(config.logName, error, (fileError) => {
    if (fileError) {
      console.error(fileError);
    }
  });
  res.status(500).end();
}

function _isAuthorized(req, role) {
  var sessionUser = new User(req.session.user);
  return sessionUser.hasRole(appId, role);
}

function _sendUnauthorized(res) {
  res.status(403).send({
    "errors": [{
      "code": "[notAuthorized]"
    }]
  });
}

module.exports = router;
