var fs = require("fs");

/**
 * This module loads a configuration files. It defaults to loading the config-dev.json in the current directory.
 * However, it also checks if the file <code>/usr/local/inversoft/config/config-production.json</code> exists and if
 * it does, it loads that file instead.
 *
 * This is useful for production environments because you don't check in things like the database username and password
 * into source control. You can also lock down the production file on the file system so that only the application can
 * read it.
 */
var config = require("./config-dev.json");
try {
  var stats = fs.statSync("/usr/local/inversoft/config/config-production.json");
  if (stats.isFile()) {
    config = require("/usr/local/inversoft/config/config-production.json");
  }
} catch (err) {
  // Already initialized to a good value, ignoring the exception for now
}

module.exports = config;
