export default {
  handleErrors: function (loginErrors) {
    var errors = {};
    for (var i in loginErrors.errors) {
      errors[i] = loginErrors.errors[i][0].message;
    }
    return errors;
  }
};
