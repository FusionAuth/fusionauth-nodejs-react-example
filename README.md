# FusionAuth NodeJS and React Todo Example

This project contains an example project that illustrates using FusionAuth with NodeJS and React. The Node and React applications each have their own Readme with further explanations of the applications, including configuration options. Each application also has examples of how to deploy it view Jenkins, Gitlab, or Drone.

## About
The application uses the core features a person would want to use from software like FusionAuth. In order to do that, the Todo example includes routing to make all of these items happen. Included features are:
* Signup / login.
  * Email verification before logging in is allowed.
* Forgot password workflow.
* View / edit profile details.
* Enable / disable 2FA.
* Change password while logged in.
* Working with a MongoDB model (Todos) with a logged in user.
  * Create, read, update, delete Todos.
* Authentication of a route before allowing access to the page.

## Prerequisites
You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)

## Installation
* `git clone https://github.com/fusionauth/fusionauth-nodejs-react-example`
* `cd fusionauth-nodejs-react-example`
* `./server npm install`
* `./frontend npm install`

## FusionAuth and Database Configuration
* Choose your preferred [installation method](https://fusionauth.io/docs/v1/tech/installation-guide/).
  * This demo will cover the `Fast Path` option as a quick way to get up and running.
* Install the dependencies for your Operating System (this will do it in the current directory).
  * MacOS
    * `sh -c "curl -fsSL https://raw.githubusercontent.com/FusionAuth/fusionauth-install/master/install.sh | sh"`
  * Windows
    * `iex (new-object net.webclient).downloadstring('https://raw.githubusercontent.com/FusionAuth/fusionauth-install/master/install.ps1)`
  * Linux (zip)
    * `sh -c "curl -fsSL https://raw.githubusercontent.com/FusionAuth/fusionauth-install/master/install.sh | sh -s - -z"`
  * Linux (DEB or RPM)
    * `sh -c "curl -fsSL https://raw.githubusercontent.com/FusionAuth/fusionauth-install/master/install.sh | sh"`
* Start the FusionAuth App.
  * `./fusionauth/bin/startup.sh`
    * The installer will also give the full path to the startup file.
* Ensure MySQL is up and running with a root user.
* Create a MongoDB database. We'll use a free tier from [MongoDB Cloud](https://cloud.mongodb.com/).
  * Sign in and create a new Project.
  * Create a cluster on the new project. Choose a name and click create. You don't need to add additional team members.
  * Create a new Cluster for the project. Each project can support one free cluster.
    * If the cluster being created is the first for the project, you have the choice of using a starter cluster which is free. Choose that. You can name the cluster or accept the default name of `Cluster0`.
  * On the `Network Access` tab, add a new IP to be able to access the cluster.
    * Either add your own IP, or add 0.0.0.0.
  * On the `Database Access` tab, create a new user `demo` with the role `Read and Write any database`.
    * Set a password (`demoPass`).
  * Once the cluster is provisioned, click the `Clusters` tab. Then click `Connect` followed by `Connect your application`. The default language is NodeJS. Copy the connection string.
    * Connection string is in the format `mongodb+srv://cookbook:<password>@something.mongodb.net/test?retryWrites=true&w=majority`
    * You will want the portion of the URL between the `@` and `/test` -> `something.mongodb.net`
* Open [http://localhost:9011](http://localhost:9011) in your browser to set up FusionAuth.
  * You can leave the defaults for all the options, but you will need to provide the root MySQL or PostgreSQL username and password.
  * The next page asks for information to create a FusionAuth admin account.

## Running / Development
* `./server npm start`
  * Debug mode `./server node --inspect server.js`
* `./frontend npm start`
  * This should open a browser to [http://localhost:3000](http://localhost:3000).

## App Configuration

Details for how to configure each application (Node / React) will be detailed in their respective folders. This section will go over how to get everything set up as information may be required by both applications.

* Create an application in FusionAuth.
  * Give it a name (`FusionAuth Demo`).
  * Add a role of `member` and check on the `Default` box for that role.
  * On the `JWT` tab, click the `Enable` button.
  * **On the `Registration` tab, click the `Verify Registration` button. Use the `Email Verification` for the `Verification Template`.**
  * On the `Security` tab, click the `Allow refresh token` button and uncheck the `Require an API key` button.
  * Save.
  * Grab the `Application ID` for the new application.
  * Grab the `Application Secret` for the new application.
* Create an API key.
  * Give it a description and do not click any of the buttons. This will be a root key for demo purposes.
  * Grab the `ID` of the API key.
* Enable emails
  * Settings -> Tenants (Default) -> Email
  * Use the appropriate settings for your email host.
  * Click the `Verify Email` button.
  * Use the `Email Verification` for the `Verification Template`.
* Replace the `Email Verification` and `Forgot Password Verification` email templates with the HTML provided.
  * In the email templates, you will need to change `Site Name` to your site's name.
  * You will also need to change `https://your-site.com/` to your own domain.
  * You will need to change the `From Email` in FusionAuth on both templates to the email used in the email setup.
* Add the required routing authentication to the MongoDB database.
  * Visit the cluster for the project you create @ [MongoDB](https://cloud.mongodb.com).
  * On the `Clusters` tab, click `Collections`.
  * Under the `fusionAuthDemo` database, click `roles`.
  * Click `Insert Document`.
  * Beside the `VIEW` text, click the blank looking button. This will be a free form editor.
  * Paste the content from `mongodb/roles.json` and click `Insert`.