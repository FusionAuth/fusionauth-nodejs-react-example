# Passport JS Example

This project contains an example project that illustrates using Passport with Node and Ember.

## Prerequisites
You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)

## Installation
* `git clone https://github.com/inversoft/passport-bluemix-example` this repository
* `cd passport-bluemix-example`
* `cd server`
* `npm install`
* `cd ../react`
* `npm install`

## Running / Development
* Start up Passport Backend
* Log into Passport Backend and create a new API key using the value from the `server/config/config.json` configuration file
* Create a MySQL database called `user_todos` by executing this in the MySQL shell
  * `create database user_todos character set = 'utf8mb4' collate = 'utf8mb4_bin';`
* Grant privileges to the dev user to this database by executing this in the MySQL shell 
  * `grant all on user_todos.* to 'dev'@'localhost' identified by 'dev';`
* `cd server`
* `npm start`  
* `cd ../react`
* `npm start`
* Open your browser to [https://localhost:8081](https://localhost:8081).

## Optional Node Debugging in Chrome
* `npm install -g node-inspector`
* `cd ../server`
* `node --debug server.js`
* `node-inspector --web-port=8999 &` (or other available port)
* Open Chrome browser to [http://127.0.0.1:8999/?port=5858](http://127.0.0.1:8999/?port=5858).

## Running Tests
* `ember test`
* `ember test --server`
* `mocha`

## Building

* `ember build --output="../server/public"` (development)
* `ember build --output="../server/public" --environment production` (production)

## Deploying to Production
* Copy `server/config/config-dev.json` to `/usr/local/application/config/config-production.json`
* Replace values in config-production.json with your production values
* Have a MySQL database running and create the `user_todos` database as described above
* Have a Passport Backend running
* Generate an API key in Passport Backend and copy it to the production configuration file
* Edit the **Email Verification** template in Passport Backend so that the URL points to your web server and will hit the Ember route correctly. 
  * The URL should be something like `https://your-hostname.com/verify/${user.verificationId}`
* `cd ember`
* `npm install`
* `bower install`
* `ember build --environment production --output "../server/public"`
* `cd ../server`
* `npm install`
* `node server.js`

