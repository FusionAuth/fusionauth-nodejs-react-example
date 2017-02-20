'use strict';

const configFile = require ('./config.json');

const cfenv = require('cfenv');
const util = require('util');

const services = cfenv.getAppEnv().services;

let config = null;

// TODO probably a better way to decide if we're in dev or prod
if (util.isUndefined(services["compose-for-mysql"])) {
  config = configFile.development;
} else {
  config = configFile.production;
}

module.exports = config;
