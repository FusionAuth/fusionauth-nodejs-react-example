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

var passportResponse = function (res, clientResponse) {
  var error_response = {
    "errors": []
  };
  if (clientResponse.wasSuccessful()) {
    res.send(clientResponse);
  } else if (clientResponse.errorResponse) {
    error_response.errors = clientResponse.errorResponse.fieldErrors;
    res.send(error_response);
  } else {
    console.error(clientResponse);
    error_response.errors = {
      "general": [{"message": "Passport unreachable"}]
    };
    res.send(error_response);
  }
};

router.route("/todos")
  .get(function (req, res) {
    if (req.session && req.session.user !== undefined) {
      var index = checkRegistration(req.session.user.registrations);
      if (index > 0) {
        if (req.session.user.registrations[index].indexOf(config.passport.applicationId)) {
          console.log("authorized");
        } else {

        }
      }
      if (req.query.completed) {
        todo.retrieveCompletedTodos(req.session.user.id)
          .then(function (todos) {
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
            res.send(success_response);
          }).catch(function (err) {
          console.error(err);
          res.sendStatus(500);
        });
      } else {
        todo.retrieveTodos(req.session.user.id)
          .then(function (todos) {
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
            res.send(success_response);
          }).catch(function (err) {
          console.error(err);
          res.sendStatus(500);
        });
      }
    } else {
      req.session.destroy(function (err) {
        if (err) {
          console.error(err);
          res.sendStatus(500);
        } else {
          var error_response = {
            "errors": [{
              "msg": "please log in"
            }]
          };
          res.status(401).send(error_response);
        }
      });
    }
  }).post(function (req, res) {
  if (req.session && req.session.user.id !== undefined) {
    todo.createTodo(req.body.task, sess.user.id)
      .then(function (todo) {
        var success_response = {};
        var data = {
          "type": "todo",
          "id": todo.id,
          "attributes": {
            "task": todo.task,
            "completed": todo.completed
          }
        };
        success_response.data = data;
        res.send(success_response);
      }).catch(function (err) {
      console.error(err);
      res.sendStatus(500);
    });
  } else {
    var error_response = {
      "errors": [{
        "msg": "please log in"
      }]
    };
    res.sendStatus(401).end(error_response);
  }
});

router.route("/todos/:id")
  .put(function (req, res) {
    if (req.session && req.session.user.id !== undefined) {
      todo.retrieveTodo(req.params.id).then(function (todo) {
        if (todo.user.id === sess.user.id) {
          todo.updateTodoStatus(req.params.id)
            .then(function (todo) {
              res.send({
                todo: todo
              });
            }).catch(function (err) {
            console.error(err);
            var error_response = {
              "errors": [{
                "msg": ""
              }]
            };
            res.sendStatus(500).end(error_response);
          });
        } else {
          var error_response = {
            "errors": [{
              "msg": "please log in"
            }]
          };
          res.status(401).end(error_response);
        }
      });
    } else {
      var error_response = {
        "errors": [{
          "msg": "please log in"
        }]
      };
      res.status(401).end(error_response);
    }
  }).delete(function (req, res) {
  if (req.session && req.session.user.id !== undefined) {
    todo.retrieveTodo(req.params.id).then(function (todo) {
      if (todo.user.id === sess.user.id) {
        todo.deleteTodo(req.params.id)
          .then(function (todo) {
            res.send({
              todo: todo
            });
          }).catch(function (err) {
          console.error(err);
          res.sendStatus(500).end(error_response);
        });
      } else {
        var error_response = {
          "errors": [{
            "msg": "please log in"
          }]
        };
        res.sendStatus(401).end(error_response);
      }
    });

  } else {
    res.send("please log in");
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
      res.send(clientResponse);
    });
  });

router.route("/verify")
  .post(function (req, res) {
    passportClient.resendEmail(req.body, function (clientResponse) {
      //Error handling
      res.send(clientResponse);
    })
  })

module.exports = router;
