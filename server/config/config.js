'use strict';

const configFile = require ('./config.json');
let config = null;

const cfenv = require('cfenv');
const appenv = cfenv.getAppEnv();

if (appenv.VCAP_SERVICES) {
  config = configFile.production;
} else {
  config = configFile.development;
}

module.exports = config;
