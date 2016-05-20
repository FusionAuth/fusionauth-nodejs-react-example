/*
 * Copyright (c) 2016, Inversoft Inc., All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 */

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
