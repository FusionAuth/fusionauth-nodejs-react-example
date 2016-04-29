module.exports = function(apiKey, host) {
    this.request = require('request');
    this.apiKey = apiKey;
    this.host = host;
    this.register = function (registrationRequest, res) {
        var options = {
            url: this.host + "/api/user/registration",
            json: true,
            headers: {
                'Authorization': this.apiKey
            },
            body: registrationRequest
        };
        this.request.post(options,
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    // res.send(body);
                    res.redirect("/");
                } else if(!error) {
                    res.send(response.body);
                } else {
                    console.error(error);
                    res.send("error");
                }
            }
        );

    }

    this.login = function(loginRequest){
        var options = {
            url: this.host + "/api/login",
            json: true,
            headers: {
                'Authorization': this.apiKey
            },
            body: loginRequest
        };
        this.request.post(options,
            function (error, response, body) {
                if (!error && response.statusCode == 202) {
                    return body.user;
                } else if(!error){
                    return response.body;
                } else {
                    console.error(response);
                    console.error(error);
                    return "Error";
                }

            }
        );
    }
}