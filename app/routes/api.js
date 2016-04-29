var express = require("express"), app = express(), bodyParser = require("body-parser");
var todo = require("../models/todo.js");
// var https = require('https');
// const fs = require('fs');
require('../helpers/PassportClient.js')("822730c8-ae41-44e1-94bd-9b009e57fae8", "http://127.0.0.1:9011");
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
var applicationId = "b81c8fe5-3fd8-4462-b8d2-076bc1cf4b15";
// var apiKey = "822730c8-ae41-44e1-94bd-9b009e57fae8";

// var passport = passportClient(apiKey, "http://127.0.0.1:9011");
// console.log(passportClient.apiKey);

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
    if(sess.user_id != null) {
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
           if(todo.user_id == sess.user_id){
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
        sess = req.session;
        var options = {
            url: this.host + "/api/login",
            json: true,
            headers: {
                'Authorization': this.apiKey
            },
            body: req.body
        };
        request.post(options,
            function (error, response, body) {
                if (!error && response.statusCode == 202) {
                    sess.user_id = body.user.id;
                    sess.email = body.user.email;
                    res.send("success");
                } else if(!error){
                    res.send(response.body);
                } else {
                    console.error(response);
                    console.error(error);
                    res.send("Error");
                }

            }
        );
    });

router.route("/logout")
    .get(function (req, res) {
        req.session.destroy(function(err) {
            if(err) {
                console.error(err);
            } else {
                res.redirect('/');
            }
        });
    });

router.route("/register")
    .post(function (req, res) {
        var registrationRequest = {
            "user" : {
              "email" : req.body.email,
              "password": req.body.password
            },
            "registration": {
                "applicationId": applicationId
            }
        };
        register(registrationRequest, res);
    });

app.use('/api/', router);
app.listen(port);
console.log('api listening at /api/todo on port ' + port);
