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
var express = require("express");
var config = require("../config/config.js");
var PassportClient = require('../lib/passport-client.js');

// Build a Passport REST Client
var client = new PassportClient(config.passport.apiKey, config.passport.url);

var router = express.Router();

function _handlePassportErrorResponse(res, clientResponse) {
  res.status(clientResponse.statusCode);
  if (clientResponse.errorResponse) {
    res.set('Content-Type', 'application/json');
    res.send(clientResponse.errorResponse);
  } else if (clientResponse.exception) {
    res.json({
      generalErrors: [
        {
          "code": "[passportDown]"
        }
      ]
    });
  } else {
    res.end(); // no errorResponse or exception, just statusCode.
  }
}

// Convert to JSON API format
function _convertUser(user) {
  if (user == null || typeof (user) === "undefined") {
    return {"data": { type: "user"}};
  }

  var response = {"data": {}};
  response.data = {
    "type": "user",
    "attributes": {
      "email": user.email,
      "username": user.username
    }
  };
  return response;
}

/**
 * Service the /change-password request.
 *
 * Call PassportClient.forgotPassword passing in the JSON request body to the API.
 */
router.route("/change-password/:id").post(function(req, res) {
  client.changePassword(req.params.id, req.body)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((clientResponse) => _handlePassportErrorResponse(res, clientResponse));
});

/**
 * Service the /forgot-password request.
 *
 * Call PassportClient.forgotPassword passing in the JSON request body to the API.
 */
router.route("/forgot-password").post(function(req, res) {
  client.forgotPassword(req.body)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((clientResponse) => _handlePassportErrorResponse(res, clientResponse));
});

/**
 * Service the /login request.
 *
 * Call PassportClient.login passing in the JSON request body to the API.
 */
router.route("/login").post(function(req, res) {
  var loginRequest = {
    "applicationId": config.passport.applicationId,
    "email": req.body.email,
    "password": req.body.password
  };
  
  client.login(loginRequest)
    .then((clientResponse) => {
      req.session.user = clientResponse.successResponse.user;
      res.sendStatus(200);
    })
    .catch((clientResponse) => _handlePassportErrorResponse(res, clientResponse));
});

router.route("/logout").get(function(req, res) {
  req.session.destroy(function() {
    // Ignore for now
  });
  res.sendStatus(204);
});

router.route("/register").post(function(req, res) {
  var registrationRequest = {
    "user": {
      "email": req.body.email,
      "firstName": req.body.firstName,
      "lastName": req.body.lastName,
      "password": req.body.password
    },
    "registration": {
      "applicationId": config.passport.applicationId,
      "roles": ["RETRIEVE_TODO", "CREATE_TODO", "UPDATE_TODO", "DELETE_TODO"]
    }
  };

  client.register(null, registrationRequest)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((clientResponse) => _handlePassportErrorResponse(res, clientResponse));
});

router.route("/user").get(function(req, res) {
  res.set('Content-Type', 'application/json');
  res.send(_convertUser(req.session.user));
});

router.route("/verify/:id").get(function(req, res) {
  client.verifyEmail(req.params.id)
    .then(() => {
      res.send({data: {type: "verify",id: req.params.id}});
    })
    .catch((clientResponse) => _handlePassportErrorResponse(res, clientResponse));
});

router.route("/verify").post(function(req, res) {
  client.resendEmail(req.body.email)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((clientResponse) => _handlePassportErrorResponse(res, clientResponse));
});

module.exports = router;
