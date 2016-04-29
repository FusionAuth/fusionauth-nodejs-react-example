var express = require("express"), app = express(), bodyParser = require("body-parser");
var todo = require("../models/todo.js");
// var https = require('https');
// const fs = require('fs');
// require('../helpers/PassportClient.js')("47ee0a5a-51a7-4cc3-a351-eeade8a02c4a", "http://127.0.0.1:9011");
var Passport = require('../helpers/PassportClient.js');
var cookieParser = require('cookie-parser');
var session = require('express-session');

// const options = {
//   key: fs.readFileSync('/Users/dklatt/dev/inversoft/hacker/public/server.key'),
//   cert: fs.readFileSync('/Users/dklatt/dev/inversoft/hacker/public/server.crt')
// };

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(session({secret: 'MySecret'}));

var sess;
var applicationId = "4ed5eb32-0a97-40eb-a6d7-cca1f9fa3a0c";
var apiKey = "47ee0a5a-51a7-4cc3-a351-eeade8a02c4a";

var passportClient = new Passport.PassportClient(apiKey, "http://127.0.0.1:9011");

var port = process.env.PORT || 8080;

var router = express.Router();

router.route("/todo")
  .get(function (req, res) {
    sess = req.session;
    if (sess.user_id != null) {
      if (req.query.completed) {
        todo.retrieveCompletedTodos(sess.user_id)
          .then(function (todos) {
            res.send({
              todos: todos
            });
          }).catch(function (err) {
          console.error(err);
        });
      } else {
        todo.retrieveTodos(sess.user_id)
          .then(function (todos) {
            res.send({
              todos: todos
            });
          }).catch(function (err) {
          console.error(err);
        });
      }
    } else {
      res.send("please log in");
    }
  }).post(function (req, res) {
  sess = req.session;
  if (sess.user_id != null) {
    todo.createTodo(req.body.task, sess.user_id)
      .then(function (todo) {
        res.send({
          todo: todo
        });
      }).catch(function (err) {
      console.error(err);
    });
  } else {
    res.send("please log in");
  }
});

router.route("/todo/:id").put(function (req, res) {
  sess = req.session;
  if (sess.user_id != null) {
    todo.retrieveTodo(req.params.id).then(function (todo) {
      if (todo.user_id == sess.user_id) {
        todo.updateTodoStatus(req.params.id)
          .then(function (todo) {
            res.send({
              todo: todo
            });
          }).catch(function (err) {
          console.error(err);
        });
      } else {
        res.send("Does not exist?");
      }
    });

  } else {
    res.send("please log in");
  }
});

router.route("/login")
  .post(function (req, res) {
    console.log("login");
    passportClient.login(req.body, function (clientResponse) {
      if (clientResponse.wasSuccessful()) {
        sess = req.session;
        sess.user_id = clientResponse.successResponse.user.id;
        res.send("Success");
      } else if (clientResponse.errorResponse) {
        res.send(clientResponse.errorResponse);
      } else if (clientResponse.statusCode == 404) {
        res.send("Invalid Email or Password");
      } else {
        console.error(clientResponse);
        res.send("Error");
      }
    });
  });

router.route("/logout")
  .get(function (req, res) {
    req.session.destroy(function (err) {
      if (err) {
        console.error(err);
      } else {
        res.redirect('/');
      }
    });
  });

router.route("/register")
  .post(function (req, res) {
    var registrationRequest = {
      "user": {
        "email": req.body.email,
        "password": req.body.password
      },
      "registration": {
        "applicationId": applicationId
      }
    };
    passportClient.register(registrationRequest, function (clientResponse) {
      if (clientResponse.wasSuccessful()) {
        res.send("Success");
      } else if (clientResponse.errorResponse) {
        res.send(clientResponse.errorResponse);
      } else if (clientResponse.statusCode == 404) {
        res.send("Missing");
      } else {
        console.error(clientResponse);
        res.send("Error");
      }
    });
  });

app.use('/api/', router);
app.listen(port);
console.log('api listening at /api/todo on port ' + port);
