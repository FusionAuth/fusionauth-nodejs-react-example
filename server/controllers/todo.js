var express = require("express");
var Todo = require("../models/todo.js");
var todo = new Todo();
var config = require("../config/config.js");
var appId = config.passport.applicationId;
var router = express.Router();
require('../lib/user.js');

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
      _handleDatabaseError(err);
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
      _handleDatabaseError(err);
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
      _handleDatabaseError(err)
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
      _handleDatabaseError(err);
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

function _handleDatabaseError(error) {
  console.error(error);
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
