import Ember from "ember";

export default Ember.Route.extend({
  actions: {
    register: function () {
      var router = this;
      var email = this.controller.get('email');
      var password = this.controller.get('password');
      var confirm_password = this.controller.get('confirm_password');
      var first_name = this.controller.get('first_name');
      var last_name = this.controller.get('last_name');
      var two_factor = !!this.constroller.get('two_factor');
      //TODO all the checks
      if (!Ember.isEmpty(email) && !Ember.isEmpty(password)) {
        Ember.$.post('/api/register', {
          "email": email,
          "password": password,
          "firstName": first_name,
          "lastName": last_name,
          "twoFactor": two_factor
        }, function () {
          return router.transitionTo('index');
        });
      }
    }
  }
});
