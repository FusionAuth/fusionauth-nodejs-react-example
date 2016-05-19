import Ember from "ember";

export default Ember.Route.extend({
  model(){
    var router = this;
    Ember.$.get('/api/logout', function (response) {
      if(response.errors){
        //something went horribly wrong..?
      }
      router.transitionTo("index");
    });
  }
});
