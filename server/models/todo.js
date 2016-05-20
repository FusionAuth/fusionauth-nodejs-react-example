var Sequelize = require("sequelize");
var uuid = require("uuid");
var config = require("../config/config.js");

Todo = function() {
  var sequelize = new Sequelize(config.database.name, config.database.user, config.database.password, {
    host: config.database.host,
    dialect: "mysql",

    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  });

  this.todo = sequelize.define("todo", {
      id: {type: Sequelize.UUID, primaryKey: true, allowNull: false, unique: true},
      text: {type: Sequelize.STRING(2048)},
      completed: {type: Sequelize.BOOLEAN, allowNull: true, defaultValue: false},
      user_id: {type: Sequelize.UUID, allowNull: false}
    }, {
      indexes: [{fields: ["id", "user_id"]}]
    }
  );

  sequelize.sync().catch(function(error) {
    console.log(error);
  });
};

Todo.prototype = {
  create: function(text, userId) {
    return this.todo.create({
      id: uuid.v4(),
      text: text,
      completed: false,
      user_id: userId
    });
  },

  delete: function(id, userId) {
    return this.todo.destroy({where: {id: id, user_id: userId}});
  },

  retrieveAll: function(userId, completed) {
    return this.todo.findAll({
      where: {
        user_id: userId,
        completed: completed
      }
    });
  },

  update: function(id, userId, text, completed) {
    return this.todo.update(
      {text: text, completed: completed}, {where: {id: id, user_id: userId}}
    );
  }
};

Todo.constructor = Todo;
module.exports = Todo;
