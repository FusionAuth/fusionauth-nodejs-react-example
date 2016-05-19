var express = require("express");
var config = require("../config/config.js");
var PassportClient = require('../lib/passport-client.js');
var passportClient = new PassportClient(config.passport.apiKey, config.passport.url);

var router = express.Router();

function _handlePassportErrorResponse(res, clientResponse) {
  res.status(clientResponse.statusCode);
  if (clientResponse.errorResponse) {
    res.send(clientResponse.errorResponse);
  } else if (clientResponse.exception) {
    res.send({
      "generalErrors": [
        {
          "code": "[passportDown]"
        }
      ]
    });
  }
}

router.route("/login").post(function(req, res) {
  passportClient.login(req.body)
    .then((clientResponse) => {
      req.session.user = clientResponse.successResponse.user;
      res.sendStatus(200);
    })
    .catch((clientResponse) => _handlePassportErrorResponse(res, clientResponse));
});

router.route("/logout").get(function(req, res) {
  req.session.destroy(function(err) {
    // Ignore for now
  });
  res.sendStatus(204);
});

router.route("/register").post(function(req, res) {
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
      "applicationId": config.passport.applicationId,
      "roles": ["RETRIEVE_TODO", "CREATE_TODO", "UPDATE_TODO", "DELETE_TODO"]
    }
  };

  passportClient.register(null, registrationRequest)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((clientResponse) => _handlePassportErrorResponse(res, clientResponse));
});

router.route("/verify/:id").get(function(req, res) {
  passportClient.verifyEmail(req.params.id)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((clientResponse) => _handlePassportErrorResponse(res, clientResponse));
});

router.route("/verify").post(function(req, res) {
  passportClient.resendEmail(req.body.email)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((clientResponse) => _handlePassportErrorResponse(res, clientResponse));
});

module.exports = router;
