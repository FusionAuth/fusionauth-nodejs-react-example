'use strict';

var request = require('request');
const configFile = require ('./config.json');

console.info('load the configuration file by calling backend...');
var configuration, callBack;

// Retrieve the Passport Configuration from our back end application.
var production = process.env['NODE_ENV'] === 'production';
var baseURL = production ? configFile.production.todo.url : configFile.development.todo.url;
request.get(baseURL + '/api/passport/config', function(err, res, body) {
  if (!err && res.statusCode === 200) {
    console.info(body);
    if (production) {
      console.info('export production stuff');
      configFile.production.passport = JSON.parse(body);
      console.info('production');
      console.info(configFile.production);
      // module.exports = configFile.production;
      configuration = configFile.production;

    } else {
      console.info('export dev stuff');
      configFile.development.passport = JSON.parse(body);
      // module.exports = configFile.development;
      configuration = configFile.development;
    }

  } else {
    console.error(err);
    throw new Error('Unable to retrieve the Passport configuration. [' + res.statusCode + ']');
  }
});

module.exports = function(providedCallBack) {
  if (typeof configuration === 'undefined') {
    callBack = providedCallBack;
  } else {
    providedCallBack(configuration);
  }
};



