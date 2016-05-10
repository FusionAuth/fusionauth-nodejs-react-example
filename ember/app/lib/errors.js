export default {
  handleErrors: function (loginErrors) {
    var errors = [];
    for (var i in loginErrors.errors) {
      errors.push({
        "code": loginErrors.errors[i][0].code,
        "message": loginErrors.errors[i][0].message
      });
    }
    return errors;
  }
};
