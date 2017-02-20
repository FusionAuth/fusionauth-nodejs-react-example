const configFile = require ('./config.json');

// npm run build fails with 'let', using 'var'
var env = null;

if (process.env.VCAP_SERVICES) {
  env = JSON.parse(process.env.VCAP_SERVICES);
}

if (env) {
  // Production
  module.exports = configFile.production;
} else {
  // Development
  module.exports = configFile.development;
}
