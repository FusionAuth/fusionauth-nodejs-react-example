var Sequelize = require('sequelize');
var uuid = require('uuid');
var config = require("../config/config.js");

var sequelize = new Sequelize('user_todos', config.database.user, config.database.password, {
  host: config.database.host,
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

sequelize.sync().then(function () {
  // console.log("sync successful");
}).catch(function (error) {
  console.log(error);
});

var Todo = sequelize.define('todo', {
    id: {type: Sequelize.UUID, primaryKey: true, allowNull: false, unique: true},
    task: {type: Sequelize.STRING(100)},
    completed: {type: Sequelize.BOOLEAN, allowNull: true, defaultValue: false},
    user_id: {type: Sequelize.UUID, allowNull: false}
  }, {
    indexes: [{fields: ['id', 'user_id']}]
  }
);

exports.retrieveTodo = function (id) {
  return Todo.findById(id);
};

function retrieveAllTodos(userId, completed) {
  return Todo.findAll({
    where: {
      user_id: userId,
      completed: completed
    }
  });
};

exports.retrieveCompletedTodos = function (userId) {
  return retrieveAllTodos(userId, true);
};

exports.retrieveTodos = function (userId) {
  return retrieveAllTodos(userId, false);
};

exports.createTodo = function (task, user_id) {
  return Todo.create({
    id: uuid.v4(),
    task: task,
    completed: false,
    user_id: user_id
  });
};

exports.updateTodoStatus = function (id) {
  return Todo.findById(id).then(function (todo) {
    return Todo.update(
      {completed: !todo.completed}, {where: {id: id}}
    );
  });
};

exports.updateTodoText = function (id, task) {
  return Todo.update(
    {task: task}, {where: {id: id}}
  );
};

exports.deleteTodo = function (id) {
  return Todo.destroy({where: {id: id}});
};
