'use strict';

const config = require('../config/config.js');
const express = require('express');
const jwt = require('../lib/jwt');
const router = express.Router();
const Todo = require('../models/todo.js');
const todo = new Todo();
const {JWTManager} = require('fusionauth-node-client');


router.route('/todos').get((req, res) => {
  const decodedJWT = _decodeJWT(req);
  if (!_authorized(decodedJWT, 'RETRIEVE_TODO')) {
    _sendUnauthorized(res);
    return;
  }

  todo.retrieveAll(decodedJWT.sub, 'true' === req.query.completed)
    .then((todos) => {
      res.send(_convertToDos(todos));
    })
    .catch((err) => {
      _handleDatabaseError(res, err);
    });
});

router.route('/todos').post((req, res) => {
  const decodedJWT = _decodeJWT(req);
  if (!_authorized(decodedJWT, 'CREATE_TODO')) {
    _sendUnauthorized(res);
    return;
  }

  todo.create(req.body.text, decodedJWT.sub)
    .then((todo) => {
      res.send(_convertToDo(todo));
    })
    .catch((err) => {
      _handleDatabaseError(res, err);
    });
});

router.route('/todos/:id').put((req, res) => {
  const decodedJWT = _decodeJWT(req);
  if (!_authorized(decodedJWT, 'UPDATE_TODO')) {
    _sendUnauthorized(res);
    return;
  }

  todo.update(req.params.id, decodedJWT.sub, req.body.text, req.body.completed)
    .then((rowsUpdated) => {
      if (rowsUpdated[0] === 1) {
        res.sendStatus(204);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      _handleDatabaseError(res, err);
    });
});

router.route('/todos/:id').delete((req, res) => {
  const decodedJWT = _decodeJWT(req);
  if (!_authorized(decodedJWT, 'DELETE_TODO')) {
    _sendUnauthorized(res);
    return;
  }

  todo.delete(req.params.id, decodedJWT.sub)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(function(err) {
      _handleDatabaseError(res, err);
    });
});

function _convertToDo(todo) {
  return {
    'type': 'todo',
    'id': todo.id,
    'text': todo.text,
    'completed': todo.completed
  };
}

function _convertToDos(todos) {
  const response = {'todos': []};
  for (let i = 0; i < todos.length; i++) {
    response.todos.push(_convertToDo(todos[i]));
  }
  return response;
}

function _handleDatabaseError(res, error) {
  console.error(error);
  res.status(500).end();
}

/**
 * Return true if the request is authorized. Verify the user has the correct role, and the JWT is for the requested
 * application.
 *
 * @param {Object} decodedJWT The decoded JWT
 * @param {string} role The required role to be authorized to complete the request
 * @returns {boolean}
 * @private
 */
function _authorized(decodedJWT, role) {
  if (decodedJWT === null) {
    return false;
  }

  if (!JWTManager.isValid(decodedJWT)) {
    return false;
  }

  if (!jwt.assertIdentity(decodedJWT, 'roles', role)) {
    return false;
  }

  if (!jwt.assertIdentity(decodedJWT, 'applicationId', config.fusionauth.applicationId)) {
    return false;
  }

  return true;
}

/**
 * Decode the JWT by extracting the JWT from the HTTP request header.
 *
 * @param {Object} req The HTTP request
 * @returns {Object} the decoded JWT or null if the JWT was not found on the request or it is invalid.
 * @private
 */
function _decodeJWT(req) {
  const authorization = req.header('Authorization');
  if (authorization === null || typeof authorization === 'undefined') {
    return null;
  }

  const encodedJWT = authorization.substr('JWT '.length);
  if (encodedJWT === null || typeof encodedJWT === 'undefined') {
    return null;
  }

  return jwt.decode(encodedJWT);
}

/**
 * Set the HTTP Response with a status code of 403 and a response body indicating the user is not authorized to
 * complete the action.
 * @param {Object} res The HTTP Response
 * @private
 */
function _sendUnauthorized(res) {
  res.status(403).send({
    'errors': [{
      'code': '[notAuthorized]'
    }]
  });
}

module.exports = router;
