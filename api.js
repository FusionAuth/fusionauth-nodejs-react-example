var express = require("express"), app = express(), bodyParser = require("body-parser");
var todo = require("./todo.js");
var uuid = require('uuid');
// var https = require('https');
// const fs = require('fs');
var Passport = require('./PassportClient.js');
var session = require('express-session');
var helmet = require('helmet');
app.use(helmet());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
  secret: uuid.v4(),
  name: 'sessionId',
  cookie: {
    // secure: true,
    // maxAge: 3600 * 1000
  }
}));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://10.0.1.13:8080/*');
  // res.setHeader('Access-Control-Allow-Origin', 'http://10.0.1.13:8080/api/todos');
  next();
});

app.use(express.static(__dirname + '/dist'));

var applicationId = "4ed5eb32-0a97-40eb-a6d7-cca1f9fa3a0c";
var apiKey = "47ee0a5a-51a7-4cc3-a351-eeade8a02c4a";

var passportClient = new Passport.PassportClient(apiKey, "http://127.0.0.1:9011");

var port = 8080;

var router = express.Router();

router.route("/todos")
  .get(function (req, res) {
    console.log("get");
    console.log(req.session.id);
    if (req.session && req.session.user_id !== undefined) {
      if (req.query.completed) {
        todo.retrieveCompletedTodos(req.session.user_id)
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
        todo.retrieveTodos(req.session.user_id)
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
  console.log("hit post /todos");
  if (req.session && req.session.user_id !== undefined) {
    todo.createTodo(req.body.task, sess.user_id)
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
    if (req.session && req.session.user_id !== undefined) {
      todo.retrieveTodo(req.params.id).then(function (todo) {
        if (todo.user_id === sess.user_id) {
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
  if (req.session && req.session.user_id !== undefined) {
    todo.retrieveTodo(req.params.id).then(function (todo) {
      if (todo.user_id === sess.user_id) {
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
      if (clientResponse.wasSuccessful()) {
        req.session.user_id = clientResponse.successResponse.user.id;
        // req.session.save(function (err) {
        //   if (err) {
        //     res.sendStatus(500);
        //     console.error(err);
        //   }
        // });
        console.log("login");
        console.log(req.session.id);
        res.sendStatus(200);
      } else if (clientResponse.errorResponse) {
        // TODO pull apart clientResponse to send to ember
        res.send(clientResponse.errorResponse);
      } else if (clientResponse.statusCode === 404) {
        // TODO pull apart clientResponse to send to ember
        res.send("Invalid Email or Password");
      } else {
        console.error(clientResponse);
        res.sendStatus(500);
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
        "applicationId": applicationId
      }
    };
    passportClient.register(registrationRequest, function (clientResponse) {
      if (clientResponse.wasSuccessful()) {
        res.sendStatus(200);
      } else if (clientResponse.errorResponse) {
        // TODO pull apart clientResponse to send to ember
        res.send(clientResponse.errorResponse);
      } else if (clientResponse.statusCode === 404) {
        // TODO pull apart clientResponse to send to ember
        res.send("Missing");
      } else {
        console.error(clientResponse);
        res.sendStatus(500);
      }
    });
  });

app.use('/api/', router);
app.listen(port);
console.log('api listening at /api/todos on port ' + port);
