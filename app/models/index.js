var Sequelize = require('sequelize');

var sequelize = new Sequelize('user_todos', "root", "", {
  host: 'localhost',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
});

sequelize.sync().then(function () {
  // console.log("sync successful");
}).catch(function (error) {
  console.log(error);
})
