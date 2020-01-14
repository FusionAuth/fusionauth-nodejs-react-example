# FusionAuth React Example

This is the React portion of the FusionAuth NodeJS + React Todo Example.

## About
The React application uses React Redux for state storage for information about the user and language data, though there are more optimal solutions for larger applications for language state. Font awesome is used for icons in the application and axios is used for making requests to FusionAuth or the API server. All inputs are validated through a custom validation module prior to submitting any API request.

## Prerequisites
* Have already installed dependencies with `npm install`.

## Configuration

Configuration is done in `src/config/config.jsx`. Expressed in dot notation below.

| Parameter        | Description           | Example  |
| ------------- | ------------- | ----- |
| **FusionAuth** |
| fusionAuth.BASEURL | The URL where FusionAuth is hosted and set up. | `http://localhost:9011` |
| fusionAuth.APPLICATION_ID | The generated application ID for the app created in the FusionAuth client for the demo. | `10e4d908-7655-44af-abf0-1a031aff519a` |
| **API Server** |
| apiServer.BASEURL | The URL where the API server is hosted and set up. | `http://localhost:5000` |
| **React** |
| app.TWO_FA_NAME | A name to be given to React Redux for state storage in the browser. | `fusionAuthDemoApp` |