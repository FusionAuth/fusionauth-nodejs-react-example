import Ember from "ember";
import errorHandler from "../lib/errors";

export default Ember.Route.extend({
  actions: {
    login: function () {
      var router = this;
      var email = this.controller.get('email');
      var password = this.controller.get('password');
      Ember.$.post('/api/login', {
        "email": email,
        "password": password
      }, function (response) {
        if (response.errors) {
          var errors = errorHandler.handleLoginErrors(response);
          router.controller.set("errors", errors);
        } else {
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
