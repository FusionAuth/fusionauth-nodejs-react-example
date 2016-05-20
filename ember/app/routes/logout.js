import Ember from "ember";

export default Ember.Route.extend({
  model(){
    var self = this;
    Ember.$.get("/api/logout", function() {
      return self.transitionTo("login");
    });
  }
});
