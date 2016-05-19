import Ember from "ember";
import errorHandler from "../lib/errors";

export default Ember.Route.extend({
  actions: {
    register() {
      var router = this;
      var email = this.controller.get("email");
      var password = this.controller.get("password");
      var confirm_password = this.controller.get("confirm_password");
      var first_name = this.controller.get("first_name");
      var last_name = this.controller.get("last_name");

      var errors = {};
      var flag = true;
      if (!first_name) {
        errors["first_name"] = "Required";
        flag = false;
      }
      if (!last_name) {
        errors["last_name"] = "Required";
        flag = false;
      }
      if (password !== confirm_password) {
        errors["password"] = "Passwords do not match";
        errors["password_confirm"] = "Passwords do not match";
        flag = false;
      }
      if (flag) {
        Ember.$.post("/api/register", {
          "email": email,
          "password": password,
          "firstName": first_name,
          "lastName": last_name
        }, function() {
            return router.transitionTo("index");
        }).fail((err) => {
          errors = errorHandler.handleErrors(JSON.parse(err.responseText));
          router.controller.set("errors", errors);
        });
      } else {
        router.controller.set("errors", errors);
      }
    },
    back() {
      this.transitionTo("index");
    }
  }
});
