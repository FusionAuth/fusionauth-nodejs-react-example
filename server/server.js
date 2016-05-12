var express = require("express"), app = express(), bodyParser = require("body-parser");
var uuid = require('uuid');
var session = require('express-session');

var api = require("./controllers/api.js");

var config = require("./config/config.js");
const http = require('http');
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync(config.key.replace("%DIRNAME%", __dirname)),
  cert: fs.readFileSync(config.cert.replace("%DIRNAME%", __dirname))
};

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
  secret: uuid.v4(),
  name: 'sessionId',
  cookie: {
    secure: true,
    maxAge: 3600 * 1000
  }
}));

app.use(express.static(__dirname + '/public'));

app.use('/api/', api);

app.use(function (req, res) {
  if (req.accepts('html') || req.accepts('text/html')) {
    var options = {
      root: __dirname + '/public/',
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    };
    res.sendFile('index.html', options, function (err) {
      if (err) {
        console.log(err);
        res.status(err.status).end();
      }
    });
  } else if (req.accepts('json') || req.accepts('application/json')) {
    res.status(404).send(JSON.stringify({error: "Not found"}));
  } else {
    res.status(404).send("Not Found");
  }
});

http.createServer(function (req, res) {
  var host = req.headers.host;
  var hostname = host.split(":")[0];
  res.writeHead(301, {"Location": "https://" + hostname + ":" + config.httpsPort + req.url});
  res.end();
}).listen(config.httpPort);
https.createServer(options, app).listen(config.httpsPort);

console.log('api listening at /api/todos on port ' + config.httpsPort);
