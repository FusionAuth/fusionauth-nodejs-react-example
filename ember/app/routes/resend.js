import Ember from "ember";
import errorHandler from "../lib/errors";

export default Ember.Route.extend({
  actions: {
    resend() {
      var router = this;
      var email = this.controller.get("email");
      Ember.$.post("/api/verify", {
        "email": email
      }, function(response) {
        console.log(response);
        var errors;
        if (response.errors) {
          errors = errorHandler.handleErrors(response);
        } else {
          errors = {
            "general": "Email resent"
          };
        }
        router.controller.set("errors", errors);
      });
    }
  }
});
