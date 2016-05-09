var fs = require("fs");

try {
  var stats = fs.statSync("/usr/local/inversoft/config/config-production.json");
} catch(err) {
  //goes to dev mode
}
var config = "";
if (stats && stats.isFile()) {
  config = require("/usr/local/inversoft/config/config-production.json");
} else {
  config = require("./config-dev.json");
}

for (var property in config) {
  if (config.hasOwnProperty(property)) {
    module.exports[property] = config[property];
  }
}
