import Ember from "ember";

export default Ember.Route.extend({
  model(params){
    return this.store.findRecord('verify', params.verify_id);
  },
  actions: {
    error() {
      return this.transitionTo("resend");
    }
  }
});
