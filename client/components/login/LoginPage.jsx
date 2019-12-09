import React, { Component } from 'react';
import LoginForm from './LoginForm';


class LoginPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { login, loggedIn } = this.props;
    return (
      <div className="row">
        <div className="col-md-4 col-md-offset-4">
          <h1>Please Log in</h1>
          <LoginForm login={login} loggedIn={loggedIn} />
        </div>
      </div>
    );
  }
}

export default LoginPage;
