# Ember

This README outlines the details of collaborating on this Ember application.
A short introduction of this app could easily go here.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)
* [Mocha](http://mochajs.org/)

## Installation

* `git clone https://github.com/inversoft/passport-js-example` this repository
* change into the new directory
* `npm install`
* `cd ember`
* `bower install`

## Running / Development
* `run passport backend`
* `add the api key from server/config/config-dev.json to passport backend`
* `cd ember`
* `ember server --output="../server/public"`
* `cd ../server`
* `node server.js`
* Visit your app at [https://localhost:8081](https://localhost:8081).

### Running Tests

* `ember test`
* `ember test --server`
* `mocha`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying
* `have a mysql database running`
* `have a passport backend running`
* `generate an api key in passport backend`
* `generate an email verification template that points to https://hostname/verify/${user.verificationId}`
* `copy server/config/config-dev.json to /usr/local/inversoft/config/config-production.json`
* `replace values in config-production.json with your production values`
* `cd ember`
* `bower install`
* `npm install`
* `ember build --environment production --output "../server/public"`
* `cd ..`
* `npm install`
* `cd server`
* `node server.js`

