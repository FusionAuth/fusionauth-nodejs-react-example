var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var uuid = require("uuid");
var session = require("express-session");
var passport = require("./controllers/passport.js");
var todo = require("./controllers/todo.js");
var config = require("./config/config.js");
const http = require("http");
const https = require("https");
const fs = require("fs");

// Ensure Passport is setup by calling the bootstrapper
require("./lib/passport-bootstrap.js");

// Define the static resources above everything else so that we don't create sessions or handle the body of the request at all
app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: "application/vnd.api+json"}));

// Hook up sessions for all requests after this point. We are using a UUID as the secret, which should be secure.
app.use(session({
  secret: uuid.v4(),
  name: "sessionId",
  cookie: {
    secure: true,
    maxAge: 3600 * 1000
  }
}));

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
const options = {
  key: fs.readFileSync(config.key.replace("%DIRNAME%", __dirname)),
  cert: fs.readFileSync(config.cert.replace("%DIRNAME%", __dirname))
};

// Create HTTP server which only does a redirect to the HTTPS server
http.createServer(function(req, res) {
  var host = req.headers.host;
  var hostname = host.split(":")[0];
  res.writeHead(301, {"Location": "https://" + hostname + ":" + config.httpsPort + req.url});
  res.end();
}).listen(config.httpPort);

// Create the HTTPS server that will handle all the requests
https.createServer(options, app).listen(config.httpsPort);

console.log("The ToDo application is started and listening at on port " + config.httpsPort);
