'use strict';

var request = require('request');
const configFile = require ('./config.json');

var configuration;

// Retrieve the FusionAuth Configuration from our back end application.
var production = process.env['NODE_ENV'] === 'production';
var baseURL = production ? configFile.production.todo.url : configFile.development.todo.url;
function retrieveConfiguration(callBack) {
  request.get(baseURL + '/api/fusionauth/config', function(err, res, body) {
    if (!err && res.statusCode === 200) {
      if (production) {
        configFile.production.fusionauth = JSON.parse(body);
        configuration = configFile.production;
      } else {
        configFile.development.fusionauth = JSON.parse(body);
        configuration = configFile.development;
      }

      if (callBack) {
        callBack(configuration);
      }
    } else {
      console.error(err);
      throw new Error('Unable to retrieve the FusionAuth configuration. [' + res.statusCode + ']');
    }
  });
}

module.exports = function(callBack) {
  if (typeof configuration === 'undefined') {
    retrieveConfiguration(callBack);
  } else {
    callBack(configuration);
  }
};



