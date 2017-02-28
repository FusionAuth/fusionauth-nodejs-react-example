'use strict';

const configFile = require ('./config/config.json');
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('./build'));
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, './build', 'index.html'));
});


var production = process.env['NODE_ENV'] === 'production';
let port = configFile.development.httpPort;
if (production) {
  port = process.env.VCAP_APP_PORT || process.env.PORT;
}
app.listen(port);

console.info("Serving static content from ./build on port " + port);





