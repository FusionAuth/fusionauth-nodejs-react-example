import Ember from "ember";

export default Ember.Route.extend({
  actions: {
    login: function () {
      console.log("logging in");
      var router = this;
      var email = this.controller.get('email');
      var password = this.controller.get('password');
      // if (!Ember.isEmpty(email) && !Ember.isEmpty(password)) {
        Ember.$.post('/api/login', {
          "email": email,
          "password": password
        }, function (response) {
          var errors = [];
          console.log(response);
          if(response.fieldErrors){
            if(response.fieldErrors.email){
              errors.push({
                "message": response.fieldErrors.email[0].message
              });
            }

            if(response.fieldErrors.password){
              errors.push({
                "message": response.fieldErrors.password[0].message
              });
            }

            router.controller.set("errors", errors);
          } else if(response === "Invalid Email or Password") {
            errors.push({
              "message": "Invalid Email or Password"
            });
            router.controller.set("errors", errors);
          }else {
            return router.transitionTo('index');
          }
        });
    },
    register: function () {
      var router = this;
      return router.transitionTo('register');
    }
  }
});
