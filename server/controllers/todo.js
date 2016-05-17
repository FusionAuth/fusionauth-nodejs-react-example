var express = require("express");
var Todo = require("../models/todo.js");
var config = require("../config/config.js");
var appId = config.passport.applicationId;
var router = express.Router();
var user = require('../lib/User.js');

_handleTodoResponse = function (todo) {
  var data = {
    "type": "todo",
    "id": todo.id,
    "attributes": {
      "task": todo.task,
      "completed": todo.completed
    }
  }
  return data;
};

_handleTodosResponse = function (todos) {
  var success_response = {};
  var data = [];
  for (var i = 0; i < todos.length; i++) {
    data.push(_handleTodoResponse(todos[i]));
  }
  success_response.data = data;
  return success_response;
};

_handleUnauthorizedResponse = function (res) {
  var unauthorized_response = {
    "errors": [{
      "msg": "please log in"
    }]
  };
  res.status(401).send(unauthorized_response);
};

_isAuthenticated = function (user, todoUserId) {
  if (todoUserId !== undefined) {
    return user.id === todoUserId;
  }
  return user !== undefined && user.id !== undefined;
};

router.route("/todos").get(function (req, res) {
  if(req.session.user){var sessionUser = new user.User(req.session.user);}
  if (_isAuthenticated(sessionUser) && sessionUser.hasRole(appId, "GET")) {
    var get;
    if (req.query.completed) {
      get = Todo.retrieveCompletedTodos(sessionUser.id);
    } else {
      get = Todo.retrieveTodos(sessionUser.id);
    }
    get.then(function (todos) {
      res.send(_handleTodosResponse(todos));
    }).catch(function (err) {
      console.error(err);
      res.sendStatus(500);
    });
  } else {
    _handleUnauthorizedResponse(res);
  }
});

router.route("/todos").post(function (req, res) {
  if(req.session.user){var sessionUser = new user.User(req.session.user);}
  if (_isAuthenticated(sessionUser) && sessionUser.hasRole(appId, "POST")) {
    Todo.createTodo(req.body.task, sessionUser.id)
      .then(function (todo) {
        var response = {"data": {}};
        response.data = _handleTodoResponse(todo);
        res.send(response);
      }).catch(function (err) {
      console.error(err);
      res.sendStatus(500);
    });
  } else {
    _handleUnauthorizedResponse(res);
  }
});

router.route("/todos/:id").put(function (req, res) {
  if(req.session.user){var sessionUser = new user.User(req.session.user);}
  if (_isAuthenticated(sessionUser) && sessionUser.hasRole(appId, "PUT")) {
    Todo.retrieveTodo(req.params.id).then(function (todo) {
      if (_isAuthenticated(sessionUser, todo.user_id)) {
        var put;
        if (req.query.completed) {
          put = Todo.updateTodoStatus(req.params.id);
        } else {
          put = Todo.updateTodoText(req.params.id, req.body.task);
        }
        put.then(function () {
          var response = {"data": {}};
          response.data = _handleTodoResponse(todo);
          res.send(response);
        }).catch(function (err) {
          console.error(err);
          res.sendStatus(500);
        });
      } else {
        _handleUnauthorizedResponse(res);
      }
    });
  } else {
    _handleUnauthorizedResponse(res);
  }
});
router.route("/todos/:id").delete(function (req, res) {
  if(req.session.user){var sessionUser = new user.User(req.session.user);}
  if (_isAuthenticated(sessionUser) && sessionUser.hasRole(appId, "DELETE")) {
    Todo.retrieveTodo(req.params.id).then(function (todo) {
      if (todo === null) {
        res.send(_handleTodoResponse([]));
      }
      else if (_isAuthenticated(sessionUser, todo.user_id)) {
        Todo.deleteTodo(req.params.id)
          .then(function () {
            var response = {"data": {}};
            response.data = _handleTodoResponse(todo);
            res.send(response);
          }).catch(function (err) {
          console.error(err);
          res.sendStatus(500);
        });
      } else {
        _handleUnauthorizedResponse(res);
      }
    });
  } else {
    _handleUnauthorizedResponse(res);
  }
});

module.exports = router;
