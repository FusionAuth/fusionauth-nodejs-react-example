'use strict';
const config = require("./config/config.js");

const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('./build'));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, './build', 'index.html'));
});

console.info(process.env);
let port = config.httpPort;
if (config.mode === 'production') {
  port = process.env.VCAP_APP_PORT || process.env.PORT;
}
app.listen(port);

console.info("Serving static content from ./build on port " + port);
