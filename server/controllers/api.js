var express = require("express");
var todo = require("../models/todo.js");
var config = require("../config/config.js");
var Passport = require('../lib/PassportClient.js');

var passportClient = new Passport.PassportClient(config.passport.apiKey, config.passport.url);

var router = express.Router();

var checkRegistration = function (registrations) {
  for (var i = 0; i < registrations.length; i++) {
    if (registrations[i].applicationId == config.passport.applicationId) {
      return i;
    }
  }
  return -1;
};

var hasRole = function (req, role) {
  var registrations = req.session.user.registrations;
  var index = checkRegistration(registrations);
  if (index !== -1) {
    if (registrations[index].roles.indexOf(role) !== -1) {
      return true;
    }
  }
  return false;
};

var passportResponse = function (res, clientResponse) {
  var error_response = {
    "errors": []
  };
  if (clientResponse.wasSuccessful()) {
    res.send(clientResponse);
  } else if (clientResponse.errorResponse) {
    error_response.errors = clientResponse.errorResponse.fieldErrors;
    res.send(error_response);
  }
  else {
    console.error(clientResponse);
    error_response.errors = {
      "general": [{"message": "Passport unreachable"}]
    };
    res.send(error_response);
  }
};

var todoResponse = function (todos) {
  var success_response = {};
  var data = [];
  for (var i = 0; i < todos.length; i++) {
    data.push({
      "type": "todo",
      "id": todos[i].id,
      "attributes": {
        "task": todos[i].task,
        "completed": todos[i].completed
      }
    });
  }
  success_response.data = data;
  return success_response;
}
var unauthorized = function (res) {
  var unauthorized_response = {
    "errors": [{
      "msg": "please log in"
    }]
  };
  res.status(401).send(unauthorized_response);
};

var isAuthenticated = function (req, todoUserId) {
  if (todoUserId !== undefined) {
    return req.session.user.id === todoUserId;
  }
  return req.session.user.id !== undefined;
};

router.route("/todos").get(function (req, res) {
  if (isAuthenticated(req) && hasRole(req, "GET")) {
    if (req.query.completed) {
      todo.retrieveCompletedTodos(req.session.user.id)
        .then(function (todos) {
          res.send(todoResponse(todos));
        }).catch(function (err) {
        console.error(err);
        res.sendStatus(500);
      });
    } else {
      todo.retrieveTodos(req.session.user.id)
        .then(function (todos) {
          res.send(todoResponse(todos));
        }).catch(function (err) {
        console.error(err);
        res.sendStatus(500);
      });
    }
  } else {
    unauthorized(res);
  }
});
router.route("/todos").post(function (req, res) {
  if (isAuthenticated(req) && hasRole(req, "POST")) {
    todo.createTodo(req.body.task, req.session.user.id)
      .then(function (todo) {
        res.send(todoResponse([todo]));
      }).catch(function (err) {
      console.error(err);
      res.sendStatus(500);
    });
  } else {
    unauthorized(res);
  }
});

router.route("/todos/:id").put(function (req, res) {
  if (isAuthenticated(req) && hasRole(req, "PUT")) {
    todo.retrieveTodo(req.params.id).then(function (todo) {
      if (isAuthenticated(req, todo.user_id)) {
        todo.updateTodoStatus(req.params.id)
          .then(function (todo) {
            res.send(todoResponse([todo]));
          }).catch(function (err) {
          console.error(err);
          res.sendStatus(500);
        });
      } else {
        unauthorized(res);
      }
    });
  } else {
    unauthorized(res);
  }
});
router.route("/todos/:id").delete(function (req, res) {
  if (isAuthenticated(req) && hasRole(req, "DELETE")) {
    todo.retrieveTodo(req.params.id).then(function (todo) {
      if (isAuthenticated(req, todo.user_id)) {
        todo.deleteTodo(req.params.id)
          .then(function (todo) {
            res.send(todoResponse([todo]));
          }).catch(function (err) {
          console.error(err);
          res.sendStatus(500);
        });
      } else {
        unauthorized(res);
      }
    });
  } else {
    unauthorized(res);
  }
});

router.route("/login")
  .post(function (req, res) {
    passportClient.login(req.body, function (clientResponse) {
      var error_response = {
        "errors": {}
      };
      if (clientResponse.wasSuccessful()) {
        req.session.user = clientResponse.successResponse.user;
        res.sendStatus(200);
      } else if (clientResponse.statusCode === 404) {
        error_response.errors = {
          "email": [{"message": "Invalid email"}],
          "password": [{"message": "Invalid password"}]
        };
        res.send(error_response);
      } else if (clientResponse.statusCode === 412) {
        error_response.errors = {
          "email": [{"message": "Please verify email"}]
        };
        res.send(error_response);
      } else {
        passportResponse(res, clientResponse);
      }
    });
  });

router.route("/logout")
  .get(function (req, res) {
    req.session.destroy(function (err) {
      if (err) {
        console.error(err);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });
  });

router.route("/register")
  .post(function (req, res) {
    var registrationRequest = {
      "user": {
        "email": req.body.email,
        "password": req.body.password,
        "data": {
          "attributes": {
            "firstName": req.body.firstName,
            "lastName": req.body.lastName
          }
        }
      },
      "registration": {
        "applicationId": config.passport.applicationId
      }
    };
    passportClient.register(registrationRequest, function (clientResponse) {
      passportResponse(res, clientResponse);
    });
  });

router.route("/verify/:id")
  .get(function (req, res) {
    passportClient.verifyEmail(req.params.id, function (clientResponse) {
      passportResponse(res, clientResponse);
    });
  });

router.route("/verify")
  .post(function (req, res) {
    passportClient.resendEmail(req.body.email, function (clientResponse) {
      if (clientResponse.statusCode === 404) {
        var error_response = {};
        error_response.errors = {
          "general": [{"message": "Unable to resend verification email"}]
        };
        res.send(error_response);
      } else {
        passportResponse(res, clientResponse);
      }
    });
  });

module.exports = router;
