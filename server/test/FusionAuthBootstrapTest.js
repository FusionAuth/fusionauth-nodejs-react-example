/* jshint mocha:     true  */

'use strict';

// This does all the setup inline
require("../lib/fusionauth-bootstrap.js");

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

const config = require("../config/config.js");
const {FusionAuthClient} = require('fusionauth-node-client');
const client = new FusionAuthClient(config.fusionauth.apiKey, config.fusionauth.backendUrl);

// Install chai as promised
chai.use(chaiAsPromised);

describe("FusionAuthBootstrapTest", () => {
  // Login Success
  it("The Application should be setup", () => {
    return client.retrieveApplication(config.fusionauth.applicationId)
      .then((clientResponse) => {
        chai.assert.strictEqual(clientResponse.statusCode, 200);
        chai.assert.isNotNull(clientResponse.successResponse);
        chai.assert.strictEqual(clientResponse.successResponse.application.name, "Node.js Example");
      });
  });

  it("The system configuration should be setup", () => {
    return client.retrieveSystemConfiguration()
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
