var PassportClient = require('../../lib/PassportClient.js');
var chai = require("chai");
require("chai-as-promised");
var http = require("http");
var config = require("../../config/config.js");

var passportClient = new PassportClient(config.passport.apiKey, config.passport.url);

var loginRequest = {
  "email": "admin@inversoft.com",
  "password": "password"
};

var registrationRequest = {
  "user": {
    "email": "test@inversoft.com",
    "password": "Password1",
  },
  "registration": {
    "applicationId": config.passport.applicationId
  }
};

// Login Success
//chai.assert.isFalse(true, 'fuck');
it('')
passportClient.login(loginRequest)
  .then((clientResponse) => {
    console.log("here");
    chai.assert.isFalse(true, 'fuck');
    console.log("here");
    chai.assert.strictEqual(clientResponse.statusCode, 200);
    chai.assert.isNotNull(clientResponse.successResponse);
    done();
  })
  .catch((clientResponse) => {
    chai.assert.isFalse(true, 'fuck');
    done();
  });

//Login blank email
passportClient.login({"password": "password"}, function(response) {
  chai.assert.strictEqual(response.statusCode, 400);
  chai.assert.isNotNull(response.errorResponse);
  chai.assert.strictEqual(response.errorResponse.fieldErrors.email[0].code, "[blank]email");
});

//Login blank password
passportClient.login({"email": "admin@inversoft.com"}, function(response) {
  chai.assert.strictEqual(response.statusCode, 400);
  chai.assert.isNotNull(response.errorResponse);
  chai.assert.strictEqual(response.errorResponse.fieldErrors.password[0].code, "[blank]password");
});

//Login invalid
passportClient.login({"email": "admin@inversoft.com", "password": "wrong"}, function(response) {
  chai.assert.strictEqual(response.statusCode, 404);
});

//Register Success
passportClient.register(registrationRequest, function(response) {
  chai.assert.strictEqual(response.statusCode, 400);
  chai.assert.isNotNull(response.errorResponse);
});

var badRegistration = registrationRequest;
var badEmailInputs = ["", "test"];
var badPasswordInputs = ["", "short", "x".repeat(300), "singlecase", "Onlyalpha"];

//Invalid Registration tests
for (var i = 0; i < badEmailInputs; i++) {
  badRegistration.email = badEmailInputs[i];
  passportClient.register(badRegistration, function(response) {
    chai.assert.notStrictEqual(response.statusCode, 200);
    chai.assert.isNotNull(response.errorResponse);
  });
}

for (var i = 0; i < badPasswordInputs; i++) {
  badRegistration.password = badPasswordInputs[i];
  passportClient.register(badRegistration, function(response) {
    chai.assert.notStrictEqual(response.statusCode, 200);
    chai.assert.isNotNull(response.errorResponse);
  });
}
