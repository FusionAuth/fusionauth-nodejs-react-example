# FusionAuth NodeJS Example

This is the NodeJS portion of the FusionAuth NodeJS + React Todo Example.

## About
The NodeJS application uses Mongoose as an ORM for interacting with the MongoDB database. Express is used to serve an HTTP server, but an HTTPS server can easily be created as well if you provision an SSL certificate. The code is available for an HTTPS server (`src/expressServer/expressServer.js`), but the HTTPS server is never started in this demo.

## Prerequisites
* Have already installed dependencies with `npm install`.

## Configuration

Configuration is done in `.env`. You can copy or rename `.example.env` as a base. If you change the port, you will need to change it in the Dockerfile and Kubernetes configuration, if you deploy via that route.

| Parameter        | Description           | Example  |
| ------------- | ------------- | ----- |
| **General** |
| NODE_ENV | The environment for the application to run on. | `production` |
| HTTP_PORT | The port for the HTTP server to expose itself on. | `5000` |
| HTTPS_PORT | The port for the HTTPS server to expose itself on. | `5001` |
| **COOKIES** |
| COOKIES_SIGNED_SECRET | A secret value to be used for signing and validating cookies used for FusionAuth authentication. | You can use something like [uuid](https://www.npmjs.com/package/uuid). |
| **MongoDB** |
| DATABASE_USERNAME | The name of the user created on the MongoDB database with read and write access for the application. | `demo` |
| DATABASE_PASSWORD | The password for the MongoDB user. | `demoPass` |
| DATABASE_HOST | The hostname of the location of the MongoDB database. Can also be ip:port or domain:port. | `something.mongodb.net` |
| DATABASE_NAME | A database name for the application to use on the connection. | `fusionAuthDemo` |
| **FusionAuth** |
| FUSIONAUTH_API_KEY | The API key created in FusionAuth that provides access to resources in FusionAuth. | `Q3t_29GMZgyh_mko2rVuQ_s2qjlsZFJyJh0XirIiGVw` |
| FUSIONAUTH_APPLICATION_ID | The generated application ID for the app created in the FusionAuth client for the demo. | `10e4d908-7655-44af-abf0-1a031aff519a` |
| FUSIONAUTH_APPLICATION_SECRET | The generated application secret for the app created in the FusionAuth client for the demo. | `GUG8Hi7YzCbKUgDCRKGpPzqOrFckbNitmsYc6nGesgs` |
| **App Locations** |
| FUSIONAUTH_BASEURL | The URL where the FusionAuth server is hosted and set up. | `http://localhost:9011` |
| FRONTEND_BASEURL | The URL of where the frontend is hosted so that it can be whitelisted and allowed access to the API. | `http://localhost:3000` |