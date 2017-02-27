'use strict';

const configFile = require ('./config.json');

if (process.env['NODE_ENV'] === 'production') {
  const appenv = JSON.parse(process.env.VCAP_APPLICATION);
  const services = appenv.services;

  console.info(services);

  // Look up the service definition.
  var passportService = null;
  var user_provided = services["user-provided"];
  console.info(user_provided);
  for (var i=0; i < user_provided.length; i++) {
    if (user_provided[i].name === 'Passport-vz') {
      passportService = user_provided[i];
    }
  }

  // Override default configuration from the service definition
  configFile.production.passport.apiKey = passportService.credentials.api_key;
  configFile.production.passport.backendUrl = passportService.credentials.passport_backend_url;
  configFile.production.passport.frontendUrl = passportService.credentials.passport_frontend_url;
  // User defined Environment Variable for the Application Id
  configFile.production.passport.applicationId = process.env.passport_application_id;
  module.exports = configFile.production;
} else {
  module.exports = configFile.development;
}
