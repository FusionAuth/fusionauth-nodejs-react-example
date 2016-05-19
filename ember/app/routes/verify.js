import Ember from "ember";

export default Ember.Route.extend({
  model(params){
    var router = this;
    Ember.$.get("/api/verify/" + params.verify_id, function(response) {
      if (response.errors) {
        router.transitionTo("resend");
      }
    });
  }
});
