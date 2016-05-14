import Ember from "ember";

export default Ember.Route.extend({
  model(params){
    var router = this;
    Ember.$.get('/api/verify/' + params.verify_id, function (response) {
      if(response.statusCode === 404){
        router.transitionTo("resend");
      }
    });
  }
});
