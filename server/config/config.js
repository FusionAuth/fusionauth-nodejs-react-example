'use strict';

const configFile = require ('./config.json');

if (process.env['NODE_ENV'] === 'production') {
  const services = JSON.parse(process.env.VCAP_SERVICES);

  // Look up the service definition.
  let passportService = null;
  const user_provided = services["user-provided"];
  const serviceName = process.env.passport_service_name;
  for (let i=0; i < user_provided.length; i++) {
    if (user_provided[i].name === serviceName) {
      passportService = user_provided[i];
    }
  }

  console.info(passportService);
  var credentials = passportService.credentials;

  // Override default configuration from the service definition
  configFile.production.passport.apiKey = credentials.api_key;
  configFile.production.passport.backendUrl = credentials.passport_backend_url;
  configFile.production.passport.frontendUrl = credentials.passport_frontend_url;
  // User defined Environment Variable for the Application Id
  configFile.production.passport.applicationId = process.env.passport_application_id;

  module.exports = configFile.production;
} else {
  module.exports = configFile.development;
}
