const config = require("./config/config.js");

const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('./build'));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, './build', 'index.html'));
});

let port = config.mode === 'production' ? process.env.PORT : config.httpPort;
app.listen(port);

console.info("Serving static content from ./build on port " + port);
