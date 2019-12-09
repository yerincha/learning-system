/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-alert */
import React, { Component } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';

class AdminSignupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      phone: '',
      password: '',
      passwordConfirmation: '',
      passcode: '',
      admin: true,
      submitted: false,
    };

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
    const {
      name, email, phone, admin, password, passwordConfirmation, passcode,
    } = this.state;
    if (password !== passwordConfirmation) {
      alert('비밀번호와 비밀번호 확인이 맞지 않습니다. 비밀번호를 다시 확인해주세요');
    } else if (passcode !== 'P@ssc@dE') {
      alert('관리자 패스코드가 틀렸습니다');
    } else {
      this.setState();
      const data = {
        name,
        email,
        phone,
        admin,
        password,
      };
      axios.post('/api/admin_signup', data)
        .then(() => {
          this.setState({
            submitted: true,
          });
          alert('회원 가입을 환영합니다. 로그인 해 주세요.');
        })
        .catch(() => {
          alert('이미 등록된 이메일입니다. 다시 시도해주세요.');
        });
    }
  }

  render() {
    const { submitted } = this.state;
    return (
      <form onSubmit={this.onSubmit}>
        <h1>관라자 등록하기</h1>
        <div className="form-group">
          <label className="control-label">Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Enter Name"
            onChange={this.onChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="control-label">Email address</label>
          <input
            type="email"
            className="form-control"
            name="email"
            aria-describedby="emailHelp"
            onChange={this.onChange}
            placeholder="Enter email"
            required
          />
          <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>
        <div className="form-group">
          <label className="control-label">Phone Number</label>
          <input
            type="text"
            className="form-control"
            name="phone"
            placeholder="Enter phone number"
            onChange={this.onChange}
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
        <div className="form-group">
          <label className="control-label">Password Confimation</label>
          <input
            type="password"
            className="form-control"
            name="passwordConfirmation"
            placeholder="Password"
            onChange={this.onChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="control-label">관리자 패스코드</label>
          <input
            type="password"
            className="form-control"
            name="passcode"
            placeholder="관리자 패스코드를 입력해주세요"
            onChange={this.onChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
        {submitted ? <Redirect to="/login" /> : null}
        <div><Link to="/signup"> 관리자가 아니십니까? </Link></div>
      </form>
    );
  }
}

export default AdminSignupForm;
