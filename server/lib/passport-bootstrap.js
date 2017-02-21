'use strict';

const PassportClient = require('passport-node-client');
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./passport');
const config = require("../config/config.js");

// Build a Passport REST Client
let passportClient = new PassportClient(config.passport.apiKey, config.passport.backendUrl);

console.info('Passport Bootstrap in mode [' + config.mode + ']');

// Make sure that the application, roles and configuration is setup in Passport
passportClient.retrieveApplication(config.passport.applicationId)
  .catch((clientResponse) => {
    if (clientResponse.statusCode === 404) {
      passportClient.createApplication(config.passport.applicationId, {
          "application": {
            "name": "Node.js Example",
            "roles": [
              {
                "name": "RETRIEVE_TODO",
                "isDefault": false,
                "description": "Allows the user to retrieve their todos"
              },
              {
                "name": "CREATE_TODO",
                "isDefault": false,
                "description": "Allows the user to create a todo"
              },
              {
                "name": "UPDATE_TODO",
                "isDefault": false,
                "description": "Allows the user to update a todo"
              },
              {
                "name": "DELETE_TODO",
                "isDefault": false,
                "description": "Allows the user to delete a todo"
              }
            ]
          }
        })
        .catch((innerClientResponse) => console.error(`Unable to initialize Passport (Create Application). Please check that Passport is installed, running and not in maintenance mode. Status code from Passport was [${innerClientResponse.statusCode}]. Error response from Passport was [${JSON.stringify(innerClientResponse.errorResponse)}]`));
    } else {
      console.error(`Unable to initialize Passport (Retrieve Application). Please check that Passport is installed, running and not in maintenance mode. Status code from Passport was [${clientResponse.statusCode}]. Error response from Passport was [${JSON.stringify(clientResponse.errorResponse)}]`);
    }
  });

// Turn on email verification.
passportClient.retrieveSystemConfiguration()
.then((clientResponse) => {
  const systemConfiguration = clientResponse.successResponse.systemConfiguration;

  systemConfiguration.reportTimezone = "America/Denver";
  systemConfiguration.verifyEmail = true;
  systemConfiguration.verifyEmailWhenChanged = true;
  systemConfiguration.forgotEmailTemplateId = config.passport.forgotEmailTemplateId;
  systemConfiguration.verificationEmailTemplateId =config.passport.verificationEmailTemplateId;

  passportClient.updateSystemConfiguration({
    "systemConfiguration": systemConfiguration
  })
  .catch((clientResponse) => console.error(`Unable to initialize Passport (Update System Config). Please check that Passport is installed, running and not in maintenance mode. Status code from Passport was [${clientResponse.statusCode}]. Error response from Passport was [${JSON.stringify(clientResponse.errorResponse, null, '  ')}]`));

})
.catch((clientResponse) => console.error(`Unable to initialize Passport (Retrieve System Config). Please check that Passport is installed, running and not in maintenance mode. Status code from Passport was [${clientResponse.statusCode}]. Error response from Passport was [${JSON.stringify(clientResponse.errorResponse, null, 2)}]`));

// Retrieve the public key during start up to decode and verify the JWT
passportClient.retrieveJwtPublicKey(config.passport.applicationId)
.then((clientResponse) => {
   localStorage.publicKey = clientResponse.successResponse.publicKeys[config.passport.applicationId];
})
.catch((clientResponse) => {
  console.info(`Unable to retrieve JWT Public Key. Status code from Passport was [${clientResponse.statusCode}]. Error response from Passport was [${JSON.stringify(clientResponse.errorResponse)}]`);
});
