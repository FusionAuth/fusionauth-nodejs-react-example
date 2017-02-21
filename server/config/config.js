'use strict';

const configFile = require ('./config.json');

if (process.env['NODE_ENV'] === 'production') {
  module.exports = configFile.production;
} else {
  module.exports = configFile.development;
}
