var express = require("express"), app = express(), bodyParser = require("body-parser");
var todo = require("../models/todo.js");
var https = require('https');
const fs = require('fs');
// var request = require('request');


const options = {
  key: fs.readFileSync('/Users/dklatt/dev/inversoft/hacker/public/server.key'),
  cert: fs.readFileSync('/Users/dklatt/dev/inversoft/hacker/public/server.crt')
};

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API

var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (request, response) {
  response.json({message: 'hooray! welcome to our api!'});
});

// more routes for our API will happen here


//TODO change this to take user_id from session???
//TODO need to make this api only work if logged in
router.route("/todos/:user_id")
  .get(function (req, res) {
    console.log("get");
    if (req.query.completed) {
      todo.retrieveCompletedTodos(req.params.user_id)
        .then(function (todos) {
          res.send({
            todos: todos
          });
        }).catch(function (err) {
        console.error(err);
      });
    } else {
      todo.retrieveTodos(req.params.user_id)
        .then(function (todos) {
          res.send({
            todos: todos
          });
        }).catch(function (err) {
        console.error(err);
      });
    }
  }).post(function (req, res) {
  console.log("hit post....");
  todo.createTodo(req.body.task, req.params.user_id)
    .then(function (todo) {
      res.send({
        todo: todo
      });
    }).catch(function (err) {
    console.error(err);
  });
});

router.route("/todos/:id").put(function (req, res) {
  console.log("hit put");
  todo.updateTodoStatus(req.params.id)
    .then(function (todo) {
      res.send({
        todo: todo
      });
    }).catch(function (err) {
    console.error(err);
  });
});

router.route("/login")
  .post(function (req, res) {
    console.log("hit login");
    var options = {
      host: '127.0.0.1',
      port: '9011',
      path: '/login',
      method: 'POST',
      headers: {
        'Authorization': ENV.apiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(post_data)
      }
    };
    var login_request = https.request(options, function (res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        console.log('Response: ' + chunk);
      });
    });

    login_request.write(post_data);
    login_request.end();

    // request.post(
    //   'https://127.0.0.1:9011/login',
    //   { form: { key: 'value' } },
    //   function (error, response, body) {
    //     if (!error && response.statusCode == 200) {
    //       console.log(body)
    //     }
    //   }
    // );

  });

// REGISTER OUR ROUTES
// all of our routes will be prefixed with /api/v1
app.use('/api/', router);

// START THE SERVER
https.createServer(options, app).listen(port);
console.log('Magic happens on port ' + port);
