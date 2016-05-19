import Ember from "ember";
import config from "./config/environment";

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function () {
  this.route('index', {path: '/'});
  this.route('login');
  this.route('logout');
  this.route('register');
  this.route('verify', {path: '/verify/:verify_id'});
  this.route('resend');
});

export default Router;
