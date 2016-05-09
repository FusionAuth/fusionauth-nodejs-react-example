import Ember from "ember";

export default Ember.Route.extend({
  actions: {
    login: function () {
      console.log("logging in");
      var router = this;
      var email = this.controller.get('email');
      var password = this.controller.get('password');
      if (!Ember.isEmpty(email) && !Ember.isEmpty(password)) {
        Ember.$.post('/api/login', {
          "email": email,
          "password": password
        }, function () {
          console.log("logged in");
          return router.transitionTo('index');
        });
      }
    },
    register: function () {
      var router = this;
      return router.transitionTo('register');
    }
  }
});
