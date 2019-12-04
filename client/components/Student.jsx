import React, { Component } from 'react';
import { Redirect } from "react-router-dom";

const logged = false;

class Student extends Component {
  render() {
    return (
      <div>
        {!logged && <Redirect to="/login" />}
        강의실     
      </div>
    );
  }
}

export default Student;