var config = require("../config/config.js");
var PassportClient = require('../lib/passport-client.js');
var passportClient = new PassportClient(config.passport.apiKey, config.passport.url);

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
        .catch((innerClientResponse) => console.error(`Unable to initialize Passport. Please check that Passport is installed, running and not in maintenance mode. Status code from Passport was [${innerClientResponse.statusCode}]. Error response from Passport was [${JSON.stringify(innerClientResponse.errorResponse)}]`));
    } else {
      console.error(`Unable to initialize Passport. Please check that Passport is installed, running and not in maintenance mode. Status code from Passport was [${clientResponse.statusCode}]. Error response from Passport was [${JSON.stringify(clientResponse.errorResponse)}]`);
    }
  });

// Turn on email verification and set the password constraints
passportClient.updateSystemConfiguration({
    "systemConfiguration": {
      "passwordValidationRules": {
        "maxLength": 256,
        "minLength": 8,
        "requireMixedCase": true,
        "requireNonAlpha": true
      },
      "reportTimezone": "America/Denver",
      "verifyEmail": true,
      "verifyEmailWhenChanged": true,
      "verificationEmailTemplateId": "8da42c09-461c-45f3-b931-6e9f63b87ab5"
    }
  })
  .catch((clientResponse) => console.error(`Unable to initialize Passport. Please check that Passport is installed, running and not in maintenance mode. Status code from Passport was [${clientResponse.statusCode}]. Error response from Passport was [${JSON.stringify(clientResponse.errorResponse)}]`));
