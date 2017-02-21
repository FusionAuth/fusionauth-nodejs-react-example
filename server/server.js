'use strict';

const express = require("express");
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");
const uuid = require("uuid");
const todo = require("./controllers/todo.js");
const config = require("./config/config.js");
const http = require("http");

// Ensure Passport is setup by calling the bootstrapper
require("./lib/passport-bootstrap.js");

// Cross-Origin Resource Sharing
app.use(cors());
app.options('*', cors()); // Enable pre-flight for all routes

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: "application/vnd.api+json"}));

// Define the main routes
app.use("/api/", [todo]);

// This is the default handler that will always return the Ember index.html file for all unhandled URLs
app.use(function(req, res) {
  if (req.accepts("html") || req.accepts("text/html")) {
    var options = {
      root: __dirname + "/public/",
      dotfiles: "deny",
      headers: {
        "x-timestamp": Date.now(),
        "x-sent": true
      }
    };
    res.sendFile("index.html", options, function(err) {
      if (err) {
        console.log(err);
        res.status(err.status).end();
      }
    });
  } else if (req.accepts("json") || req.accepts("application/json")) {
    res.status(404).send(JSON.stringify({error: "Not found"}));
  } else {
    res.status(404).send("Not Found");
  }
});

let port = config.httpPort;
if (config.mode === 'production') {
  port = process.env.VCAP_APP_PORT || process.env.PORT;
}

http.createServer(app).listen(port);
console.log("The ToDo application is started and listening at on port " + port);
