import React, { Component } from 'react';
import axios from 'axios';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      phone: '',
      cohort: '',
      password: '',
      passwordConfirmation: '',
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
    axios.post('/api/students', { student: this.state })
  }
  render() {
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
</form>
    );
  }
}

export default LoginForm;