'use strict';

const config = require('../config/config.js');
const express = require('express');
const Inversoft = require('passport-node-client');
const router = express.Router();
const Todo = require('../models/todo.js');
const todo = new Todo();
let passportClient = new Inversoft.PassportClient(config.passport.apiKey, config.passport.backendUrl);

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

router.route('/passport/webhook').post((req, res) => {
  const authorization = req.header('Authorization');
  if (authorization !== 'API-KEY') {
    res.status(403).send({
      'errors': [{
        'code': '[notAuthorized]'
      }]
    });
    return;
  }

  if (req.body.event.type === 'jwt.refresh-token.revoke') {
    const duration = req.body.event.applicationTimeToLiveInSeconds[config.passport.applicationId];
    console.log('Revoking JWT for user [' + req.body.event.userId + '] for [' + duration + 's]');
    Inversoft.JWTManager.revoke(req.body.event.userId, duration);
    res.sendStatus(200);
  } else if (req.body.event.type === 'user.delete') {
    const request = req.body;
    console.log('Deleting Todos for user [' + request.event.user.id + ']');
    todo.deleteAll(request.event.user.id)
      .then(() => {
        res.sendStatus(200);
      })
      .catch(function(error) {
        console.error(error);
        res.status(500).end();
      });
  }
});

module.exports = router;
