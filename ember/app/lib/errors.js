export default {
  handleLoginErrors: function (loginErrors) {
    var errors = {};
    for (var i in loginErrors.errors) {
      errors[i] = loginErrors.errors[i][0].message;
    }
    return errors;
  },
  handleRegistrationErrors: function (registrationErrors) {
    var errors = {};
    for (var i in registrationErrors.errors) {
      errors[i.split('.')[1]] = registrationErrors.errors[i][0].message;
    }
    return errors;
  }
};
