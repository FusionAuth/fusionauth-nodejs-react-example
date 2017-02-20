
const configFile = require ('./config.json');

let env = null;

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
