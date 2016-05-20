import Ember from "ember";
import errorHandler from "../lib/errors";

export default Ember.Route.extend({
  actions: {
    login() {
      var self = this;
      var email = this.controller.get("email");
      var password = this.controller.get("password");
      Ember.$.post("/api/login", {
        "email": email,
        "password": password
      }, function() {
        return self.transitionTo("index");
      }).fail((err) => {
        var errors = errorHandler.handleErrors(JSON.parse(err.responseText));
        self.controller.set("errors", errors);
      });
    },
    register: function() {
      var self = this;
      return self.transitionTo("register");
    }
  }
});
