var request = require("supertest")
  , should = require("should")
  , express = require("express")
  , bodyParser = require("body-parser")
  , session = require("express-session")
  , chai = require("chai")
  , assert = chai.assert
  , passport = require("../controllers/passport.js")
  , todo = require("../controllers/todo.js");


describe("request(app)", function () {
  var app = express();
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(session({
    secret: "my-secret",
    name: 'sessionId',
    cookie: {
      maxAge: 3600 * 1000
    }
  }));
  app.use("/api/", passport);
  app.use("/api/", todo);

  var agent = request(app);
  var Cookies;

  var getTodo = function (todo, query) {
    it("should find the todo", function (done) {
      var req = agent.get("/api/todos");
      if (query != undefined) {
        req.query(query);
      }
      req.cookies = Cookies;
      req.end(function (err, res) {
        assert.equal(200, res.status);
        assert.equal(JSON.stringify(todo), res.text);
        done();
      });
    });
  };

  it("should login", function (done) {
    agent
      .post("/api/login")
      .send({"email": "admin@inversoft.com", "password": "password"})
      .end(function (err, res) {
        Cookies = res.headers['set-cookie'].pop().split(';')[0];
        assert.equal(200, res.status);
        getTodo({data: []});
        getTodo({data: []}, {completed: true});
        done();
      });
  });

  var toDelete = "";
  it("should create a todo", function (done) {
    var req = agent.post("/api/todos").send({"task": "testing post"});
    req.cookies = Cookies;
    req.end(function (err, res) {
      assert.equal(200, res.status);
      assert.equal(JSON.stringify({
        "data": {
          "type": "todo",
          "id": res.body.data.id,
          "attributes": {
            "task": "testing post",
            "completed": false
          }
        }
      }), res.text);
      toDelete = res.body.data.id;
      getTodo({
        "data": [{
          "type": "todo",
          "id": res.body.data.id,
          "attributes": {
            "task": "testing post",
            "completed": false
          }
        }]
      });
      done();
    });
  });

  it("should update the todo", function (done) {
    var req = agent.put("/api/todos/" + toDelete).send({"task": "testing put"});
    req.cookies = Cookies;
    req.end(function (err, res) {
      assert.equal(200, res.status);
      assert.equal(JSON.stringify({
        "data": {
          "type": "todo",
          "id": res.body.data.id,
          "attributes": {
            "task": "testing post",
            "completed": false
          }
        }
      }), res.text);
      getTodo({
        "data": [{
          "type": "todo",
          "id": res.body.data.id,
          "attributes": {
            "task": "testing put",
            "completed": false
          }
        }]
      });
      done();
    });
  });

  it("should complete the todo", function (done) {
    var req = agent.put("/api/todos/" + toDelete).query({completed: true});
    req.cookies = Cookies;
    req.end(function (err, res) {
      assert.equal(200, res.status);
      assert.equal(JSON.stringify({
        "data": {
          "type": "todo",
          "id": res.body.data.id,
          "attributes": {
            "task": "testing put",
            "completed": false
          }
        }
      }), res.text);
      getTodo({
        "data": [{
          "type": "todo",
          "id": res.body.data.id,
          "attributes": {
            "task": "testing put",
            "completed": true
          }
        }]
      }, {completed: true});
      getTodo({data: []});
      done();
    });
  });

  it("should delete the todo", function (done) {
    var req = agent.delete("/api/todos/" + toDelete);
    req.cookies = Cookies;
    req.end(function (err, res) {
      assert.equal(200, res.status);
      assert.equal(JSON.stringify({
        "data": {
          "type": "todo",
          "id": res.body.data.id,
          "attributes": {
            "task": "testing put",
            "completed": true
          }
        }
      }), res.text);
      getTodo({data: []}, {completed: true});
      getTodo({data: []});
      done();
    });
  });

});
