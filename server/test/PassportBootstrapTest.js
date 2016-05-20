var PassportClient = require("../lib/PassportClient.js");
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var http = require("http");
var config = require("../config/config.js");

// Install chai as promised
chai.use(chaiAsPromised);

describe("PassportClientTest", () => {
  var passportClient = new PassportClient(config.passport.apiKey, config.passport.url);

  var loginRequest = {
    "email": "admin@inversoft.com",
    "password": "password"
  };

  var badLoginRequest = {
    "email": "admin@inversoft.com",
    "password": "bad-password"
  };

  var userId = "05D81252-1D1D-11E6-87EC-2D1B0608D449";
  var registrationRequest = {
    "user": {
      "email": "test@inversoft.com",
      "password": "Password1"
    },
    "registration": {
      "applicationId": config.passport.applicationId
    }
  };

  // Login Success
  it("Should log in admin", () => {
    return passportClient.login(loginRequest)
      .then((clientResponse) => {
        chai.assert.strictEqual(clientResponse.statusCode, 200);
        chai.assert.isNotNull(clientResponse.successResponse);
      });
  });

  // Login Failure
  it("Should not log in admin", () => {
    return passportClient.login(badLoginRequest)
      .catch((clientResponse) => {
        chai.assert.strictEqual(clientResponse.statusCode, 404);
        chai.assert.isNull(clientResponse.successResponse);
        chai.assert.isNull(clientResponse.errorResponse);
      });
  });

  // Login blank email
  it("Should return email error", () => {
    return passportClient.login({"password": "password"})
      .catch((response) => {
        chai.assert.strictEqual(response.statusCode, 400);
        chai.assert.isNotNull(response.errorResponse);
        chai.assert.strictEqual(response.errorResponse.fieldErrors.email[0].code, "[blank]email");
      });
  });

  // Login blank password
  it("Should return password error", () => {
    return passportClient.login({"email": "admin@inversoft.com"})
      .catch((response) => {
        chai.assert.strictEqual(response.statusCode, 400);
        chai.assert.isNotNull(response.errorResponse);
        chai.assert.strictEqual(response.errorResponse.fieldErrors.password[0].code, "[blank]password");
      });
  });

  // CLEAN UP HERE TO DELETE THE USER
  it("cleanup", () => {
    return passportClient.deleteUser(userId)
      .then((response) => {
        chai.assert.strictEqual(response.statusCode, 200);
        chai.assert.isNull(response.successResponse);
      })
      .catch((response) => {
        chai.assert.strictEqual(response.statusCode, 404);
        chai.assert.isNull(response.successResponse);
        chai.assert.isNull(response.errorResponse);
      });
  });

  // Register Success
  it("Should register a user", () => {
    return passportClient.register(userId, registrationRequest)
      .then((response) => {
        chai.assert.strictEqual(response.statusCode, 200);
        chai.assert.isNotNull(response.successResponse);
      });
  });

  //Resend email verification
  it("Should resend the verification email", () => {
    return passportClient.resendEmail(registrationRequest.user.email)
      .then((response) => {
        chai.assert.strictEqual(response.statusCode, 200);
        chai.assert.isNull(response.successResponse);
        chai.assert.isNull(response.errorResponse);
      });
  });

  it("Should fail on password validation - empty password", () => {
    return _badPasswordPromise("");
  });

  it("Should fail on password validation - short password", () => {
    return _badPasswordPromise("short");
  });

  it("Should fail on password validation - long password", () => {
    return _badPasswordPromise("x".repeat(300));
  });

  it("Should fail on password validation - singlecase", () => {
    return _badPasswordPromise("singlecase");
  });

  it("Should fail on password validation - Onlyalpha", () => {
    return _badPasswordPromise("Onlyalpha");
  });

  it("Should fail on email validation - empty email", () => {
    return _badEmailPromise("");
  });

  it("Should fail on email validation - invalid email", () => {
    return _badEmailPromise("invalid");
  });

  var badRegistration = registrationRequest;

  function _badPasswordPromise(password) {
    badRegistration.password = password;
    return passportClient.register(null, badRegistration)
      .catch((response) => {
        chai.assert.strictEqual(response.statusCode, 400);
        chai.assert.isNotNull(response.errorResponse);
      });
  }

  function _badEmailPromise(email) {
    badRegistration.email = email;
    return passportClient.register(null, badRegistration)
      .catch((response) => {
        chai.assert.strictEqual(response.statusCode, 400);
        chai.assert.isNotNull(response.errorResponse);
      });
  }
});
