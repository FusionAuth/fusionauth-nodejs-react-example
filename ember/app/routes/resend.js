import Ember from "ember";
import errorHandler from "../lib/errors";

export default Ember.Route.extend({
  actions: {
    resend: function () {
      var router = this;
      var email = this.controller.get('email');
      Ember.$.post('/api/verifies', {
        "email": email
      }, function (response) {
        var errors;
        if (response.errors) {
          errors = errorHandler.handleErrors(response);
          router.controller.set("errors", errors);
        } else {
          errors = {
            "general" : "Email resent"
          };
          router.controller.set("errors", errors);
        }
      });
    }
  }
});
