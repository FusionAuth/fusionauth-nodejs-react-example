import Model from "ember-data/model";
import attr from "ember-data/attr";

export default Model.extend({
  text: attr("string"),
  completed: attr("boolean")
});
