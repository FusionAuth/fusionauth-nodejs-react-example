'use strict';

const configFile = require ('./src/config/config.json');
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('./build'));
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, './build', 'index.html'));
});

let port = process.env.VCAP_APP_PORT || process.env.PORT;
if (typeof port === 'undefined') {
  port = configFile.development.httpPort;
}
app.listen(port);

console.info("Serving static content from ./build on port " + port);





