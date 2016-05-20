/*
 * Copyright (c) 2016, Inversoft Inc., All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 */

var Sequelize = require("sequelize");
var uuid = require("uuid");
var config = require("../config/config.js");

var fs = require("fs");
var logFile = fs.openSync(config.logName, "a");

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
    fs.appendFile(config.logName, error, (fileError) => {
      if (fileError) {
        console.error(fileError);
      }
    });
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
