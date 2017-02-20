//import PassportClient from 'passport-node-client';
//const client = new PassportClient('1cfd3949-a5db-4f3c-a936-b18519ecd0c2', 'http://frontend.local');

// TODO Cleanup and use PassportClient where possible

const config = require("../config/config.js");

console.info('auth');
console.info(config);
module.exports = {
  login(email, password, callBack) {
    callBack = arguments[arguments.length - 1];
    if (localStorage.access_token) {
      if (callBack) {
        callBack(200);
      }
      this.onChange(true);
      return;
    }

    const data = new FormData();
    data.append('loginId', email);
    data.append('password', password);
    data.append('grant_type', 'password');
    data.append('client_id', config.passport.applicationId);

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = (function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status < 200 || xhr.status > 299) {
          if (xhr.status === 400) {
            const errors = [];
            const errorResponse = JSON.parse(xhr.responseText);
            console.info(JSON.stringify(errorResponse, null, 2));
            if (errorResponse.generalErrors && errorResponse.generalErrors.length > 0) {
              errors.push(errorResponse.generalErrors[0].message);
            } else {
              for(let property in errorResponse.fieldErrors) {
                if (errorResponse.fieldErrors.hasOwnProperty(property)) {
                  for (let i=0; i < errorResponse.fieldErrors[property].length; i++) {
                    errors.push(errorResponse.fieldErrors[property][i].code);
                  }
                }
              }
            }
            if (callBack) {
              callBack(xhr.status, errors);
            }
          } else {
            if (callBack) {
              callBack(xhr.status);
            }
          }
        } else {
          // Success
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            this.retrieveUser(response.access_token, () => {
              if (callBack) {
                callBack(xhr.status, response);
              }
            });
          } else {
            if (callBack) {
              callBack(xhr.status);
            }
          }
        }
      }
    }).bind(this);

    xhr.open('POST', config.passport.frontendUrl + '/oauth2/token', true);
    xhr.send(data);
  },

  retrieveUser(encodedJWT, callBack) {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status < 200 || xhr.status > 299) {
          if (xhr.status === 400) {
            console.info('fail [' + xhr.status + ']');
          } else {
            console.info('fail [' + xhr.status + ']');
          }
        } else {
          // try to get a name out of the user response.
          const user = JSON.parse(xhr.responseText).user;
          localStorage.email = user.email;
          if (user.firstName && user.lastName) {
            localStorage.name = user.firstName + ' ' + user.lastName;
          } else if (user.username) {
            localStorage.name = user.username;
          } else {
            localStorage.name = user.email;
          }
          if (callBack) {
            callBack();
          }
        }
      }
    };

    xhr.open('GET', config.passport.backendUrl + '/api/user', true);
    xhr.setRequestHeader('Authorization', 'JWT ' + encodedJWT);
    xhr.send();
  },

  getToken() {
    return localStorage.access_token
  },

  logout(callBack) {
    delete localStorage.access_token;
    delete localStorage.userId;
    delete localStorage.email;
    delete localStorage.name;
    if (callBack) {
      callBack();
    }
    this.onChange(false);
  },

  loggedIn() {
    return !!localStorage.access_token;
  },

  register(email, password, callBack) {
    const requestBody = {
      user: {
        email: email,
        password: password
      },
      registration: {
        applicationId: config.passport.applicationId,
        roles: [
          'RETRIEVE_TODO', 'CREATE_TODO', 'UPDATE_TODO', 'DELETE_TODO'
        ]
      },
      skipVerification: true
    };

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = (function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status < 200 || xhr.status > 299) {
          if (xhr.status === 400) {
            const errors = [];
            const errorResponse = JSON.parse(xhr.responseText);
            console.info(JSON.stringify(errorResponse, null, 2));
            if (errorResponse.generalErrors && errorResponse.generalErrors.length > 0) {
              errors.push(errorResponse.generalErrors[0].message);
            } else {
              // Using email for registration, ignore username errors
              for(let property in errorResponse.fieldErrors) {
                if (property === 'user.username') {
                  continue;
                }

                if (errorResponse.fieldErrors.hasOwnProperty(property)) {
                  for (let i=0; i < errorResponse.fieldErrors[property].length; i++) {

                    errors.push(errorResponse.fieldErrors[property][i].code);
                  }
                }
              }
            }
            if (callBack) {
              callBack(xhr.status, errors);
            }
          } else {
            console.info('fail [' + xhr.status + ']');
          }
        } else {
          this.login(email, password, (status, response) => {
            if (status === 200) {
              localStorage.access_token = response.access_token;
              localStorage.userId = response.userId;
              if (callBack) {
                callBack(xhr.status);
              }
            }
          });
        }
      }
    }).bind(this);

    xhr.open('POST', config.passport.backendUrl + '/api/user/registration', true);
    xhr.setRequestHeader('Authorization', config.passport.apiKey);
    xhr.setRequestHeader("Content-type","application/json");

    const jsonRequest = JSON.stringify(requestBody);
    xhr.send(jsonRequest);
  },

  onChange() {}
}
