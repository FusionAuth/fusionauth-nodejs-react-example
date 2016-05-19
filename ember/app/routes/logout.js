import Ember from "ember";

export default Ember.Route.extend({
  model(){
    var router = this;
    Ember.$.get("/api/logout", function() {
      return router.transitionTo("login");
    });
  }
});
