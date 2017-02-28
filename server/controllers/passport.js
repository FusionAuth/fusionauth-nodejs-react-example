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
router.route('/passport/register').post((req, res) => {

  // fill out the registration part of the request.
  let request = {
    user: req.body.user,
    registration: {
      applicationId: config.passport.applicationId,
      roles: [
        'RETRIEVE_TODO', 'CREATE_TODO', 'UPDATE_TODO', 'DELETE_TODO'
      ]
    },
    skipVerification: true
  };

  passportClient.register(null, request)
    .then((response) => {
      res.send(response.successResponse);
    })
    .catch((response) => {
      res.status(response.statusCode).send(response.errorResponse);
    });
});

module.exports = router;
