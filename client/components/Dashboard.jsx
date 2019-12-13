/* eslint-disable no-alert */
import React from 'react';
import Axios from 'axios';

import { makeStyles } from '@material-ui/core/styles';

import {
  Button, Box, Typography, Container, Select, FormControl, MenuItem, InputLabel,
} from '@material-ui/core';
import Copyright from './Copyright';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 300,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const [allCourse, setAllCourse] = React.useState('');
  const [allStudent, setAllStudent] = React.useState('');
  const [selectedCourse, setSelectedCourse] = React.useState('');
  const [selectedStudent, setSelectedStudent] = React.useState('');

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
    } else if (selectedCourse === null || selectedCourse === '') {
      alert('Should select course');
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
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Course Passcode Generator
        </Typography>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-helper-label">Please Select Course</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={selectedCourse}
            onChange={handleCourseChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {allCourse
              ? allCourse.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.title}
                </MenuItem>
              ))
              : null}
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-helper-label">Please Select Student</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={selectedStudent}
            onChange={handleStudentChange}
          >
            <MenuItem value="none">
              <em>None</em>
            </MenuItem>
            {allStudent
              ? allStudent.map(
                (student) => <MenuItem key={student.name} value={student.id}>{`${student.name} (${student.email})`}</MenuItem>,
              ) : null}
          </Select>
        </FormControl>
        <Button
          // fullWidth
          variant="contained"
          color="primary"
          onClick={generateCode}
        >
          Generate Invitation Code
        </Button>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default Dashboard;
