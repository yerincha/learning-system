import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import App from './App.jsx';
import Greetings from './components/Greetings.jsx';
import SignupPage from "./components/signup/SignupPage.jsx";


ReactDOM.render(
  <Router >
    <div>
      <Route path="/" component={App} />
      <Route exact path="/" component={Greetings} />
      <Route path="/signup" component={SignupPage} />
    </div>
  </Router>, document.getElementById('main'));
