'use strict';

const configFile = require ('./config.json');

// if (process.env['NODE_ENV'] === 'production') {
if (process.env['VCAP_SERVICES']) {
  const services = JSON.parse(process.env.VCAP_SERVICES);

  // Look up the service definition.
  let fusionauthService = null;
  const user_provided = services["user-provided"];
  const serviceName = process.env.fusionauth_service_name;
  for (let i=0; i < user_provided.length; i++) {
    if (user_provided[i].name === serviceName) {
      fusionauthService = user_provided[i];
    }
  }

  console.info(fusionauthService);
  var credentials = fusionauthService.credentials;

  // Override default configuration from the service definition
  configFile.production.fusionauth.apiKey = credentials.api_key;
  configFile.production.fusionauth.backendUrl = credentials.fusionauth_backend_url;

  // User defined Environment Variable for the Application Id
  configFile.production.fusionauth.applicationId = process.env.fusionauth_application_id;

  module.exports = configFile.production;
} else {
  module.exports = configFile.development;
}
