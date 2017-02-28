'use strict';

const config = require('../config/config.js');
const express = require('express');
const PassportClient = require('passport-node-client');
const router = express.Router();
let passportClient = new PassportClient(config.passport.apiKey, config.passport.backendUrl);

// Return the Passport Configuration
router.route('/passport/config').get((req, res) => {
  delete config.passport.apiKey;
  res.send(config.passport);
});

// Register a new user
router.route('/passport/register').get((req, res) => {
  let request = JSON.parse(req.body);
  // fill out the registration part of the request.
  request.registration = {
    applicationId: config.passport.applicationId,
      roles: [
      'RETRIEVE_TODO', 'CREATE_TODO', 'UPDATE_TODO', 'DELETE_TODO'
    ]
  };
  request.skipVerification = true;

  passportClient.register(null, request)
    .then((response) => {
      res.send(response.successResponse);
    })
    .catch((response) => {
      // return the same status and error
      // this._handleErrors(xhr, callBack, ['user.username']);
      console.info('error?');
      console.info(response);
    });
});

module.exports = router;
