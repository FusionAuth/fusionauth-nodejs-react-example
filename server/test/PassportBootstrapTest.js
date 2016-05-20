/*
 * Copyright (c) 2016, Inversoft Inc., All Rights Reserved
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

// This does all the setup inline
require("../lib/passport-bootstrap.js");

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");

var config = require("../config/config.js");
var PassportClient = require('../lib/passport-client.js');
var passportClient = new PassportClient(config.passport.apiKey, config.passport.url);

// Install chai as promised
chai.use(chaiAsPromised);

describe("PassportBootstrapTest", () => {
  // Login Success
  it("The Application should be setup", () => {
    return passportClient.retrieveApplication(config.passport.applicationId)
      .then((clientResponse) => {
        chai.assert.strictEqual(clientResponse.statusCode, 200);
        chai.assert.isNotNull(clientResponse.successResponse);
        chai.assert.strictEqual(clientResponse.successResponse.application.name, "Node.js Example");
      });
  });

  it("The system configuration should be setup", () => {
    return passportClient.retrieveSystemConfiguration()
      .then((clientResponse) => {
        chai.assert.strictEqual(clientResponse.statusCode, 200);
        chai.assert.isNotNull(clientResponse.successResponse);
        chai.assert.isTrue(clientResponse.successResponse.systemConfiguration.verifyEmail);
        chai.assert.isTrue(clientResponse.successResponse.systemConfiguration.verifyEmailWhenChanged);
        chai.assert.strictEqual(clientResponse.successResponse.systemConfiguration.verificationEmailTemplateId, "8da42c09-461c-45f3-b931-6e9f63b87ab5");
        chai.assert.strictEqual(clientResponse.successResponse.systemConfiguration.passwordValidationRules.maxLength, 256);
        chai.assert.strictEqual(clientResponse.successResponse.systemConfiguration.passwordValidationRules.minLength, 8);
        chai.assert.isTrue(clientResponse.successResponse.systemConfiguration.passwordValidationRules.requireMixedCase);
        chai.assert.isTrue(clientResponse.successResponse.systemConfiguration.passwordValidationRules.requireNonAlpha);
      });
  });
});
