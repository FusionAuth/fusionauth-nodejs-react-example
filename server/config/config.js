'use strict';

const configFile = require ('./config.json');

let env = null;

if (process.env.VCAP_SERVICES) {
  env = JSON.parse(process.env.VCAP_SERVICES);
}

let config = null;
if (env) {
  config = configFile.production;
} else {
  config = configFile.development;
}

module.exports = config;
