import React, { Component } from 'react';
import axios from 'axios';

class SignupForm extends Component {
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
          <label className="control-label">Your Cohort</label>
          <select className="form-control" name="cohort" onChange={this.onChange} >
            <option value="" disabled> Choose your cohort </option>
            <option> Flex 1기 </option>
            <option> Flex 2기 </option>
            <option> Full-time 1기</option>
            <option> Full-time 2기</option>
            <option> 주말 직장인 반 1기</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
</form>
    );
  }
}

export default SignupForm;