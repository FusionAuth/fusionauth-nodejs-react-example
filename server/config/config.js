'use strict';

const configFile = require ('./config.json');

if (process.env.VCAP_APPLICATION == null) {
  module.exports = configFile.development;
} else {
  module.exports = configFile.production;
}
