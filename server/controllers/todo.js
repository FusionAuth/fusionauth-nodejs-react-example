/*
 * Copyright (c) 2016-2017, Inversoft Inc., All Rights Reserved
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
const appId = config.passport.applicationId;
var router = express.Router();
var User = require('../lib/user.js');

// Ensure the user is logged in for every request in this route and if they aren't return 401 with an error
router.all("/todos", (req, res, next) => {
  let authenticated = true;
  if (!authenticated) {
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
  const jwt = _decodeJWT(req);
  if (!_isAuthorized(jwt, "RETRIEVE_TODO")) {
    _sendUnauthorized(res);
    return;
  }

  todo.retrieveAll(jwt.sub, "true" === req.query.completed)
    .then((todos) => {
      res.send(_convertTodos(todos));
    })
    .catch((err) => {
      _handleDatabaseError(res, err);
    });
});

router.route("/todos").post((req, res) => {
  const jwt = _decodeJWT(req);
  if (!_isAuthorized(jwt, "CREATE_TODO")) {
    _sendUnauthorized(res);
    return;
  }

  todo.create(req.body.data.attributes.text, jwt.sub)
    .then((todo) => {
      res.send(_convertTodo(todo));
    })
    .catch((err) => {
      _handleDatabaseError(res, err);
    });
});

router.route("/todos/:id").put((req, res) => {
  const jwt = _decodeJWT(req);
  if (!_isAuthorized(jwt, "UPDATE_TODO")) {
    _sendUnauthorized(res);
    return;
  }

  todo.update(req.params.id, jwt.sub, req.body.data.attributes.text, req.body.data.attributes.completed)
    .then((rowsUpdated) => {
      if (rowsUpdated[0] === 1) {
        res.sendStatus(204);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      _handleDatabaseError(res, err);
    });
});

router.route("/todos/:id").delete((req, res) => {
  const jwt = _decodeJWT(req);
  if (!_isAuthorized(jwt, "DELETE_TODO")) {
    _sendUnauthorized(res);
    return;
  }

  todo.delete(req.params.id, jwt.sub)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(function(err) {
      _handleDatabaseError(res, err);
    });
});

// Convert to JSON API format
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
  res.status(500).end();
}

function _isAuthorized(jwt, role) {
  if (jwt === null) {
    return false;
  }

  console.info('authorize this JWT:');
  console.info(jwt);
  // JWT must match this application
  if (!jwt.applicationId || jwt.applicationId !== appId) {
    console.info('not authorized, wrong application. [' + jwt.applicationId + ' !== ' + appId + ']');
    return false;
  }

  const authenticated = jwt.roles && jwt.roles.indexOf(role) !== -1;
  if (authenticated) {
    console.info('authenticated!');
  } else {
    console.info('failed authentication: roles [' + jwt.roles + ']. Required role [' + role + ']');
  }

  // JWT must contain the specified role
  return authenticated;
}

function _decodeJWT(req) {
  try {
    const authorization = req.header('Authorization');
    if (authorization === null || typeof authorization === 'undefined') {
      return false;
    }

    const encodedJWT = authorization.substr('JWT '.length);
    if (encodedJWT === null || typeof encodedJWT === 'undefined') {
      return false;
    }

    const firstIndex = encodedJWT.indexOf('.');
    const lastIndex = encodedJWT.lastIndexOf('.');
    const encodedPayload = encodedJWT.substring(firstIndex + 1, lastIndex);
    const payload = Buffer.from(encodedPayload, 'base64');
    console.info(JSON.parse(payload));

    // TODO Verify Signature

    return JSON.parse(payload);
  } catch (e) {
    return null;
  }
}

function _sendUnauthorized(res) {
  res.status(403).send({
    "errors": [{
      "code": "[notAuthorized]"
    }]
  });
}

module.exports = router;
