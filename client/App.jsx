import React from 'react';
import {
  BrowserRouter as Router, Route, Switch, Redirect,
} from 'react-router-dom';
import axios from 'axios';
import { CssBaseline } from '@material-ui/core';

import NavigationBar from './components/NavigationBar';
import Home from './components/Main/Home';
import Classroom from './components/Main/Classroom';
import SignupForm from './components/SignForm/SignUpForm';
import AdminSignupForm from './components/SignForm/AdminSignUpForm';
import SignInForm from './components/SignForm/SignInForm';
import SignOut from './components/SignForm/SignOut';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      userId: '',
      course: [],
      isAdmin: false,
      name: '',
    };
    this.login = this.login.bind(this);
    this.signout = this.signout.bind(this);
    this.fetchUserData = this.fetchUserData.bind(this);
    this.fetchCourseData = this.fetchCourseData.bind(this);
  }

  componentDidMount() {
    this.fetchUserData();
  }

  login(user) {
    // console.log('user', user.admin);
    this.setState({
      loggedIn: true,
      userId: user.id,
      isAdmin: user.admin,
      name: user.name,
    }, this.fetchUserData);
  }

  fetchUserData() {
    const { userId, isAdmin } = this.state;
    axios.get(`/user?id=${userId}`, { isAdmin })
      .then((result) => {
        // console.log('data', result.data)
        if (result.status === 200) {
          this.setState({
            loggedIn: true,
            userId: result.data.id,
            isAdmin: result.data.admin,
            name: result.data.name,
            course: result.data.course,
          });
        }
      });
  }

  fetchCourseData() {
    const { userId, isAdmin } = this.state;

    axios.get('/api/course', {
      params: {
        id: userId,
        isAdmin,
      },
    })
      .then((courses) => {
        console.log('courses', courses);
        this.setState({
          course: courses.data,
        });
      });
  }

  signout() {
    axios.get('/api/signout');
    this.setState({
      loggedIn: false,
      isAdmin: false,
      userId: '',
      name: '',
    });
  }


  render() {
    const {
      loggedIn, name, course, isAdmin,
    } = this.state;

    const PrivateRoute = ({ component: Component, ...rest }) => (
      <Route
        {...rest}
        render={(props) => (
          loggedIn
            // ? <Component {...props} />
            ? <Classroom {...props} />
            : <Redirect to="/login" />
        )}
      />
    );

    return (
      <Router>
        <CssBaseline />
        <NavigationBar name={name} loggedIn={loggedIn} />
        <Switch>
          <Route exact path="/login">
            <SignInForm login={this.login} loggedIn={loggedIn} />
          </Route>
          <Route exact path="/signup">
            <SignupForm />
          </Route>
          <Route exact path="/">
            <Home
              loggedIn={loggedIn}
              course={course}
              isAdmin={isAdmin}
              adminName={name}
              fetchCourseData={this.fetchCourseData}
            />
          </Route>
          <Route exact path="/admin_signup">
            <AdminSignupForm />
          </Route>
          <Route exact path="/signout">
            <SignOut signout={this.signout} />
          </Route>
          <PrivateRoute path="/classroom" course={course} />
        </Switch>
      </Router>
    );
  }
}

export default App;
