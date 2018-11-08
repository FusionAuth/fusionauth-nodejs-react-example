# FusionAuth Node.js and React Example

This project contains an example project that illustrates using FusionAuth with Node and React.

## Prerequisites
You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)

## Installation
* `git clone https://github.com/fusionauth/fusionauth-nodejs-react-example`
* `cd fusionauth-nodejs-react-example`
* `./server> npm install`
* `./react> npm install`

## FusionAuth and Database Configuration
* Start up FusionAuth App
* Log into FusionAuth App and create a new API key using the value from the `server/config/config.json` configuration file
* Create a MySQL database called `user_todos` by executing this in the MySQL shell
  * `create database user_todos character set = 'utf8mb4' collate = 'utf8mb4_bin';`
* Grant privileges to the dev user to this database by executing this in the MySQL shell 
  * `grant all on user_todos.* to 'dev'@'localhost' identified by 'dev';`
  
## Running / Development
* `./server> npm start`
  * Debug mode `./server> node --inspect server.js`
* `./react> npm start`
  * This should open a browser to [https://localhost:3000](https://localhost:3000). 
