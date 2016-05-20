import Ember from "ember";
import errorHandler from "../lib/errors";

export default Ember.Route.extend({
  actions: {
    resend() {
      var self = this;
      var email = this.controller.get("email");
      Ember.$.post("/api/verify", {
        "email": email
      }, function() {
        console.log("here");
        self.controller.set("errors", { "general": "Email resent" });
      }).fail((err) => {
        var errors = {"email" : "Email not found"};
        if(err.responseText){
          errors = errorHandler.handleErrors(JSON.parse(err.responseText));
        }
        self.controller.set("errors", errors);
      });
    }
  }
});
