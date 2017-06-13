'use strict';
const config = require("../config/config.js");
const jwa = require('jwa');
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./passport');

module.exports = {

  /**
   * Decode the provided encoded JWT.
   *
   * @param {string} encodedJWT The encoded JWT
   * @returns {object} The decoded JWT or null if the JWT is not valid.
   */
  decode(encodedJWT) {
    try {
      const parts = encodedJWT.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const header = JSON.parse(Buffer.from(parts[0], 'base64'));
      const payload = Buffer.from(parts[1], 'base64');

      // Verify header key id matches application
      if (header.kid !== config.passport.applicationId) {
        return null;
      }

      let verified = false;
      const schema = header['alg'];

      switch (schema) {
        case 'RS256':
          verified = jwa(schema).verify(parts[0] + '.' + parts[1], parts[2], localStorage.publicKey);
          break;
        case 'RS384':
          verified = jwa(schema).verify(parts[0] + '.' + parts[1], parts[2], localStorage.publicKey);
          break;
        case 'RS512':
          verified = jwa(schema).verify(parts[0] + '.' + parts[1], parts[2], localStorage.publicKey);
          break;
        default:
          verified = false;
      }

      if (!verified) {
        return null;
      }

      const decodedJWT = JSON.parse(payload);
      const now = Math.round(new Date().getTime() / 1000);

      // Make sure the JWT is not expired
      if (decodedJWT.exp && decodedJWT.exp < now) {
        return null;
      }

      // If a Not Before Claim was provided, validate it.
      if (decodedJWT.nbf && decodedJWT.nbf > now) {
        return null;
      }

      return decodedJWT;
    } catch (e) {
      return null;
    }
  },

  /**
   * Assert on the JWT identity values.
   *
   * @param {object} decodedJWT The decoded JWT
   * @param {string} property The property name in the JWT.
   * @param {string} expected The expected value of the JWT property.
   * @returns {boolean} return true if the identity assertion is true.
   */
  assertIdentity(decodedJWT, property, expected) {
    if (decodedJWT === null || typeof decodedJWT === 'undefined') {
      return false;
    }

    if (!decodedJWT.hasOwnProperty(property)) {
      return false;
    }

    const actual = decodedJWT[property];
    if (actual === null || typeof actual === 'undefined') {
      return false;
    }

    if (typeof actual === 'string') {
      return actual === expected;
    } else if (Array.isArray(actual)) {
      return actual.indexOf(expected) !== -1;
    }

    // Not implemented
    return false;
  }

};

