import Model from "ember-data/model";
import attr from "ember-data/attr";

export default Model.extend({
  task: attr("string"),
  completed: attr("boolean")
});
