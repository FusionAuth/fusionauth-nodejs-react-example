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
  client.login(req.body)
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

  client.register(null, registrationRequest)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((clientResponse) => _handlePassportErrorResponse(res, clientResponse));
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
