export default {
  handleErrors: function (errorResponse) {
    var message = {};
    var errors = errorResponse.errors;
    for (var i in errors) {
      var key = i;
      if (i.split('.')[1] !== undefined) {
        key = i.split('.')[1];
      }
      message[key] = errors[i][0].code !== undefined ? this.translateCode(errors[i][0].code) : errors[i][0].message;
    }
    return message;
  },
  translateCode: function (code) {
    var codes = {
      "[blank]email": "Required",
      "[blank]user.email": "Required",
      "[duplicate]user.email": "Email already used",
      "[notEmail]user.email": "Not a valid Email",
      "[blank]password": "Required",
      "[blank]user.password": "Required",
      "[onlyAlpha]user.password": "Password must contain at least one non-alphabetical character",
      "[singleCase]user.password": "Password must contain at least one upper and lower case character",
      "[tooShort]user.password": "Password must be at least 8 characters long",
      "[tooLong]user.password": "Password is too long"
    };
    return codes[code];
  }
};
