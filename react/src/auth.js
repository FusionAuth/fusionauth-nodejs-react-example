//import PassportClient from 'passport-node-client';
//const client = new PassportClient('1cfd3949-a5db-4f3c-a936-b18519ecd0c2', 'http://frontend.local');

module.exports = {
  login(email, password, callback) {
    callback = arguments[arguments.length - 1];
    if (localStorage.access_token) {
      if (callback) {
        callback(true);
      }
      this.onChange(true);
      return;
    }

    var formData = new FormData();
    formData.append('loginId', email);
    formData.append('password', password);
    formData.append('grant_type', 'password');
    formData.append('client_id', '4ed5eb32-0a97-40eb-a6d7-cca1f9fa3a0c')

    var request = new Request('http://frontend.local/oauth2/token',
      {
        method: 'POST',
        mode: 'cors',
        body: formData
      }
    );

    fetch(request).then(function(response) {
      if (response.status === 200) {
        response.json().then(function(json) {
          localStorage.access_token = json.access_token;
          localStorage.userId = json.userId;
          if (callback) {
            callback(true, json);
          }
        });
      } else {
        console.info(response.status);
        if (response.status === 400) {
          response.json().then((json) => {
            console.info(JSON.stringify(json, null, 2));
            if (callback) {
              callback(false, json);
            }
          });
        } else {
          if (callback) {
            callback(false);
          }          
        }

      }
    });
  },

  getToken() {
    return localStorage.access_token
  },

  logout(callback) {
    delete localStorage.access_token;
    delete localStorage.userId;
    if (callback) {
      callback();
    }
    this.onChange(false);
  },

  loggedIn() {
    return !!localStorage.access_token;
  },

  onChange() {}
}
