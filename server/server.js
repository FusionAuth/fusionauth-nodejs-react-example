'use strict';

const express = require("express");
const app = express();
const cfenv = require('cfenv');
const cors = require('cors');
const bodyParser = require("body-parser");
const uuid = require("uuid");
const session = require("express-session");
const passport = require("./controllers/passport.js");
const todo = require("./controllers/todo.js");
const config = require("./config/config.js");
const http = require("http");
const https = require("https");
const fs = require("fs");

// Ensure Passport is setup by calling the bootstrapper
require("./lib/passport-bootstrap.js");

// Cross-Origin Resource Sharing
app.use(cors());
app.options('*', cors()); // Enable pre-flight for all routes

// Define the static resources above everything else so that we don't create sessions or handle the body of the request at all
app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: "application/vnd.api+json"}));

// Define the main routes
app.use("/api/", [passport, todo]);

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

// SSL options for the HTTPS server below
// const options = {
//   key: fs.readFileSync(config.key.replace("%DIRNAME%", __dirname)),
//   cert: fs.readFileSync(config.cert.replace("%DIRNAME%", __dirname))
// };

// Create HTTP server which only does a redirect to the HTTPS server
// Commented out for dev purposes
// http.createServer(function(req, res) {
//   var host = req.headers.host;
//   var hostname = host.split(":")[0];
//   var redirectURL = "https://" + hostname;
//   if (config.httpsRedirectPort !== 443) {
//     redirectURL += ":" + config.httpsPort;
//   }
//   res.writeHead(301, {"Location": redirectURL + req.url});
//   res.end();
// }).listen(config.httpPort);


const appEnv = cfenv.getAppEnv();
console.info(appEnv);

let port = config.httpPort;
if (config.mode === 'production') {
  port = appEnv.port;
}

// Create the HTTPS server that will handle all the requests
http.createServer(app).listen(port);
// https.createServer(options, app).listen(config.httpsPort);

console.log("The ToDo application is started and listening at on port " + port);
