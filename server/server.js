var express = require("express"), app = express(), bodyParser = require("body-parser");
var uuid = require('uuid');
var session = require('express-session');
var helmet = require('helmet');

var api = require("./controllers/api.js");

var config = require("./config/config.js");
const http = require('http');
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync(config.key),
  cert: fs.readFileSync(config.cert)
};


app.use(helmet());

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

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://10.0.1.13:8080/*');
  next();
});

app.use(express.static(__dirname + '/public'));

app.use('/api/', api);

http.createServer(function(req, res) {
  var host = req.headers.host;
  var hostname = host.split(":")[0];
  res.writeHead(301, {"Location" : "https://" + hostname + ":" + config.httpsPort + req.url});
  res.end();
}).listen(config.httpPort);
https.createServer(options, app).listen(config.httpsPort);

console.log('api listening at /api/todos on port ' + config.httpsPort);
