/* eslint-disable no-alert */
/* eslint-disable no-else-return */
import React from 'react';
import propTypes from 'prop-types';
import Axios from 'axios';

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const [allCourse, setAllCourse] = React.useState(null);
  const [allStudent, setAllStudent] = React.useState(null);
  const [selectedCourse, setSelectedCourse] = React.useState(null);
  const [selectedStudent, setSelectedStudent] = React.useState(null);

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
  };
  const handleStudentChange = (event) => {
    setSelectedStudent(event.target.value);
  };

  const fetchAllCourse = (callback) => {
    Axios.get('/api/course_all')
      .then((courses) => {
        setAllCourse(courses.data);
      })
      .then(() => {
        callback();
      })
      .catch(() => {
        alert('Can not load courses');
      });
  };

  const fetchAllStudent = () => {
    Axios.get('/api/student_all')
      .then((students) => {
        setAllStudent(students.data);
      })
      .catch(() => {
        alert('Can not load students');
      });
  };

  React.useEffect(() => {
    // setLabelWidth(inputLabel.current.offsetWidth);
    fetchAllCourse(fetchAllStudent);
  }, []);

  const makeid = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i += 1) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const generateCode = () => {
    const code = makeid(6);
    if (selectedStudent === null || selectedStudent === '') {
      alert('Should select student');
      return;
    } else if (selectedCourse === null || selectedCourse === '') {
      alert('Should select course');
      return;
    } else {
      Axios.post('/api/code', {
        userId: selectedStudent,
        courseId: selectedCourse,
        code,
      })
        .then((res) => {
          alert(`The unique code is ${res.data}`);
        })
        .catch((err) => {
          if (err.response.status === 400) {
            alert('Student is already invited to the course');
          } else {
            alert('Fail to generate unique code');
          }
        });
    };
  };

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-helper-label">Course</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={selectedCourse}
          onChange={handleCourseChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {allCourse ? allCourse.map((course) => <MenuItem value={course.id}>{course.title}</MenuItem>) : null}
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-helper-label">Student</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={selectedStudent}
          onChange={handleStudentChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {allStudent ? allStudent.map((student) => <MenuItem value={student.id}>{`${student.name} (${student.email})`}</MenuItem>) : null}
        </Select>
      </FormControl>
      <Button onClick={generateCode}>Generate Invitation Code</Button>
    </div>
  );
};

Dashboard.propTypes = {

};

export default Dashboard;
