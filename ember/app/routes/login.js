import Ember from "ember";
import errorHandler from "../lib/errors";

export default Ember.Route.extend({
  actions: {
    login() {
      var router = this;
      var email = this.controller.get("email");
      var password = this.controller.get("password");
      Ember.$.post("/api/login", {
        "email": email,
        "password": password
      }, function() {
        return router.transitionTo("index");
      }).fail((err) => {
        console.log(err);
        var errors = errorHandler.handleErrors(JSON.parse(err.responseText));
        router.controller.set("errors", errors);
      });
    },
    register: function() {
      var router = this;
      return router.transitionTo("register");
    }
  }
});
