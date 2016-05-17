var express = require("express");
var config = require("../config/config.js");
var Passport = require('../lib/PassportClient.js');
var passportClient = new Passport.PassportClient(config.passport.apiKey, config.passport.url);

var router = express.Router();

_handlePassportResponse = function (res, clientResponse) {
  var error_response = {
    "errors": []
  };
  if (clientResponse.wasSuccessful()) {
    res.send(clientResponse);
  } else if (clientResponse.errorResponse) {
    error_response.errors = clientResponse.errorResponse.fieldErrors;
    res.send(error_response);
  }
  else {
    console.error(clientResponse);
    error_response.errors = {
      "general": [{"message": "Passport unreachable"}]
    };
    res.send(error_response);
  }
}
;

router.route("/login")
  .post(function (req, res) {
    passportClient.login(req.body, function (clientResponse) {
      var error_response = {
        "errors": {}
      };
      if (clientResponse.wasSuccessful()) {
        req.session.user = clientResponse.successResponse.user;
        res.sendStatus(200);
      } else if (clientResponse.statusCode === 404) {
        error_response.errors = {
          "email": [{"message": "Invalid email"}],
          "password": [{"message": "Invalid password"}]
        };
        res.send(error_response);
      } else if (clientResponse.statusCode === 412) {
        error_response.errors = {
          "email": [{"message": "Please verify email"}]
        };
        res.send(error_response);
      } else {
        _handlePassportResponse(res, clientResponse);
      }
    });
  });

router.route("/logout")
  .get(function (req, res) {
    req.session.destroy(function (err) {
      if (err) {
        console.error(err);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });
  });

router.route("/register")
  .post(function (req, res) {
    var registrationRequest = {
      "user": {
        "email": req.body.email,
        "password": req.body.password,
        "data": {
          "attributes": {
            "firstName": req.body.firstName,
            "lastName": req.body.lastName
          }
        }
      },
      "registration": {
        "applicationId": config.passport.applicationId
      }
    };
    passportClient.register(registrationRequest, function (clientResponse) {
      _handlePassportResponse(res, clientResponse);
    });
  });

router.route("/verify/:id")
  .get(function (req, res) {
    passportClient.verifyEmail(req.params.id, function (clientResponse) {
      _handlePassportResponse(res, clientResponse);
    });
  });

router.route("/verify")
  .post(function (req, res) {
    passportClient.resendEmail(req.body.email, function (clientResponse) {
      if (clientResponse.statusCode === 404) {
        var error_response = {};
        error_response.errors = {
          "general": [{"message": "Unable to resend verification email"}]
        };
        res.send(error_response);
      } else {
        _handlePassportResponse(res, clientResponse);
      }
    });
  });

module.exports = router;
