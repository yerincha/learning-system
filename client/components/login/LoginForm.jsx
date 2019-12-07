import React, { Component } from 'react';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isValid: true,
    }

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  onSubmit(e) {
    e.preventDefault();
    const { email, password } = this.state;
    const { login } = this.props;
    axios.post('/api/login', { email, password })
      .then((res) => {
        login(res);
      })
      .catch(() => {
        console.log('not valid')
        this.setState({
          isValid: false,
        })
      });
  }
  render() {
    const { loggedIn } = this.props;
    const { isValid } = this.state;
    return (
      <form onSubmit={this.onSubmit}>
        <div className="form-group">
          <label className="control-label">Email address</label>
          <input
            type="email"
            className="form-control"
            name="email"
            onChange={this.onChange}
            placeholder="Enter email"
            required
          />
        </div>

        <div className="form-group">
          <label className="control-label">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            placeholder="Password"
            onChange={this.onChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Submit</button>
        {isValid
          ?
          null
          :
          <div>
            <div> 이메일 주소, 혹은 비밀번호가 다릅니다.</div>
          </div>
        }
        <div> <Link to='/signup'> 아직도 회원이 아니십니까? </Link></div>
        <div>{loggedIn ? <Redirect to='/' /> : <Redirect to='/login' />} </div>
      </form>
    );
  }
}

export default LoginForm;