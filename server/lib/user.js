User = function (user) {
  this.email = user.email;
  this.id = user.id;
  this.registrations = user.registrations;
  this.username = user.username;
};

User.constructor = User;

User.prototype = {
  isRegistered: function (applicationId) {
    for (var i = 0; i < this.registrations.length; i++) {
      if (this.registrations[i].applicationId == applicationId) {
        return i;
      }
    }
    return -1;
  },
  hasRole: function (applicationId, role) {
    var index = this.isRegistered(applicationId);
    if (index !== -1) {
      if (this.registrations[index].roles.indexOf(role) !== -1) {
        return true;
      }
    }
    return false;
  }
};

module.exports = User;
