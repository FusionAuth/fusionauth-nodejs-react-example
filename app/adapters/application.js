import DS from "ember-data";

var ApplicationAdapter = DS.RESTAdapter.extend({
  namespace: 'api',
  host: 'http://example.com',
  pathForType: function(type) {
    return type + '.json';
  }
});

export default ApplicationAdapter;
