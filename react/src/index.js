import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, IndexRoute, Router, Route } from 'react-router';

import App from './App';
import auth from './auth';
import Login from './components/Login';
import Register from './components/Register';
import Logout from './components/Logout';
import ToDoListContainer from './components/containers/ToDoListContainer';

import './assets/index.css';

function requireAuth(nextState, replace) {
  if (!auth.loggedIn()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App} >
      <IndexRoute component={ToDoListContainer} onEnter={requireAuth} />
      <Route path="login" component={Login} />
      <Route path="logout" component={Logout} />
      <Route path="register" component={Register} />
    </Route>
  </Router>,
  document.getElementById('root')
);
