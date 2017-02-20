/*
 * Copyright (c) 2016-2017, Inversoft Inc., All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 */

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
.catch((clientResponse) => console.error(`Unable to initialize Passport (Retrieve System Config). Please check that Passport is installed, running and not in maintenance mode. Status code from Passport was [${clientResponse.statusCode}]. Error response from Passport was [${JSON.stringify(clientResponse.errorResponse)}]`));

// TODO Retrieve public key for this application for JWT validation
console.info('/api/jwt/public-key/' + config.passport.applicationId);
passportClient.retrieveJwtPublicKey(config.passport.applicationId)
  .then((clientResponse) => {
  console.info('success: [' + clientResponse.status + ']');
  console.info(JSON.parse(clientResponse.successResponse, null, 2));
  // session storage or local storage?
     localStorage.publicKey = clientResponse.publicKeys[config.passport.applicationId];
     console.info('got public key!');
     console.info(localStorage.publicKey);
  })
  .catch((clientResponse) => {
    localStorage.publicKey = "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsUQq0RjqvuxyOwTHxyl9r\nsGY5OJz+GIsax2pkqyt7h2VmpUkStFfDq6siBXDVLU5EBuEn3eicx+oCr5Ff2xfcz\n4em47053DQHcMevDhVOW2mk8wMRU96nNC2kEbLeAnEut0/hfiUoOqP04wwMIvqUZk\n/zyM5IOBgUSF3n1oqXT3jUhSce+a4DIayV3ylPW6u1462qDc9WTRxMXLFGeOIqRhi\npuXhBgjkov6LqY5SRfwHouTdOG0HX2/n9RrLqtfl324pg4jcD5jiblDzrod9KXAJO\nbQB0PWMSjFRNwHxdHk9fHx7zfPDqEiAhi7qAUSR1aBsmOiQPpgb78KIZ8yn0QIDAQ\nAB\n-----END PUBLIC KEY-----\n";
    console.info(`Unable to retrieve JWT Public Key. Status code from Passport was [${clientResponse.statusCode}]. Error response from Passport was [${JSON.stringify(clientResponse.errorResponse)}]`);
  });
