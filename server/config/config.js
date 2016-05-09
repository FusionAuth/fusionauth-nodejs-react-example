var fs = require("fs");
//
// var foo = {
//   "foo": "bar",
//   "bar": function() {
//     this.foo = "hello";
//     this[foo] = "bar";
//     this["foo"] = "bar";
//     this.setProperty("foo", "bar");
//   }
// };
//
// foo.prototype = {
//
// };
//
// Foo = function() {
//   this.foo = "bar";
//   this.bar = function() {
//
//   };
// };
//
// Foo.prototype = {
//   foo: "hello",
//   bar: function() {
//
//   }
// };
//
// var f = new Foo();
// f.foo = "hello";
// f.bar();

try {
  var stats = fs.statSync("/usr/local/inversoft/config/config-production.json");
} catch(err) {
  //goes to dev mode
}
var config = "";
if (stats && stats.isFile()) {
  config = require("/usr/local/inversoft/config/config-production.json");
} else {
  config = require("./config-dev.json");
}

for (var property in config) {
  if (config.hasOwnProperty(property)) {
    module.exports[property] = config[property];
  }
}
