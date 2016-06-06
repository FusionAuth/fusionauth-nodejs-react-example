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

// private local functions
var _private = {

  /**
   * Map of Passport API error codes to end user message codes.
   */
  codes: {
    '[blank]email': 'Required',
    '[blank]user.email': 'Required',
    '[duplicate]user.email': 'Email already used',
    '[notEmail]user.email': 'Not a valid Email',
    '[missingEmail]': 'Email address not found.',
    '[blank]password': 'Required',
    '[blank]user.password': 'Required',
    '[badChangeVerificationId]': 'The verification code is invalid. Click Forgot password to resend the reset request.',
    '[onlyAlpha]user.password': 'Password must contain at least one non-alphabetical character',
    '[onlyAlpha]password': 'Password must contain at least one non-alphabetical character',
    '[singleCase]user.password': 'Password must contain at least one upper and lower case character',
    '[singleCase]password': 'Password must contain at least one upper and lower case character',
    '[tooShort]user.password': 'Password must be at least 8 characters long',
    '[tooShort]password': 'Password must be at least 8 characters long',
    '[tooLong]user.password': 'Password is too long',
    '[tooLong]password': 'Password is too long',
    '[passportDown]': 'Login and registration temporarily unavailable.',
    '[unexpectedError]': 'Oops. This is awkward. Something went wrong.'
  },

  mapFieldErrors: function(messages, errors) {
    for (var i in errors) {
      var key = i;
      if (errors.hasOwnProperty(key)) {
        if (i.split('.')[1] !== undefined) {
          key = i.split('.')[1];
        }
        messages[key] = errors[i][0].code !== undefined ? this.codes[errors[i][0].code] : errors[i][0].message;
      }
    }
  },

  mapGeneralErrors: function(messages, errors) {
    for (var i in errors) {
      var key = i;
      if (errors.hasOwnProperty(key)) {
        if (i.split('.')[1] !== undefined) {
          key = i.split('.')[1];
        }
        messages['general'] = errors[i].code !== undefined ? this.codes[errors[i].code] : errors[i].message;
      }
    }
  }
};

export default {
  handleErrors: function(errorResponse) {
    var messages = {};
    _private.mapFieldErrors(messages,  errorResponse['fieldErrors']);
    _private.mapGeneralErrors(messages, errorResponse['generalErrors']);

    return messages;
  },
  fieldError: function(field, errorCode) {
    var messages = {};
    messages[field] = _private.codes[errorCode];
    return messages;
  },
  generalError: function(errorCode) {
    var messages = {};
    messages['general'] = _private.codes[errorCode];
    return messages;
  }
};
