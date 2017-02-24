'use strict';

const Sequelize = require("sequelize");
const uuid = require("uuid");
const config = require("../config/config.js");

let sql;
if (config.mode === 'production') {
  const assert = require('assert');
  const util = require('util');
  // Within the application environment (appenv) there's a services object
  const appenv = JSON.parse(process.env.VCAP_APPLICATION);
  const services = appenv.services;

  const mysql_services = services["compose-for-mysql"];

  assert(!util.isUndefined(mysql_services), "Must be bound to compose-for-mysql services");

  const credentials = mysql_services[0].credentials;
  sql = new Sequelize(credentials.uri);
} else {
  // development
  sql = new Sequelize(config.database.name, config.database.user, config.database.password, {
    host: config.database.host,
    dialect: "mysql",
    logging: false,

    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  });
}

const Todo = function() {

  this.todo = sql.define("todo", {
      id: {type: Sequelize.UUID, primaryKey: true, allowNull: false, unique: true},
      text: {type: Sequelize.STRING(2048)},
      completed: {type: Sequelize.BOOLEAN, allowNull: true, defaultValue: false},
      user_id: {type: Sequelize.UUID, allowNull: false}
    }, {
      indexes: [{fields: ["id", "user_id"]}]
    }
  );

  sql.sync().catch((error) => {
    console.error(error);
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
