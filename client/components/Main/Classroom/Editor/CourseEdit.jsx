import React from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';

import {
  Button, CssBaseline, TextField, Typography, Container,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  courseform: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  coursesubmit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const CourseEdit = ({
  handleChange, courseTitle, courseSummary,
  selectedCourseItem, fetchCourseData, adminName,
}) => {
  const classes = useStyles();
  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.put('/api/course', {
      title: courseTitle,
      summary: courseSummary,
      updatedBy: adminName,
      id: selectedCourseItem.id,
    })
      .then((res) => {
        console.log(res.data);
        fetchCourseData();
      })
      .catch(() => {
        console.log('Oh no');
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="span" variant="h5">
          Course Edit
        </Typography>
        <form className={classes.courseform} onSubmit={handleSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            multiline
            id="title"
            defaultValue={selectedCourseItem.title}
            name="courseTitle"
            autoFocus
            placeholder="Course title"
            onChange={handleChange('courseTitle')}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            name="summary"
            type="summary"
            id="summary"
            multiline
            rows="4"
            placeholder="Course Summary"
            defaultValue={selectedCourseItem.summary}
            onChange={handleChange('courseSummary')}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.coursesubmit}
          >
            Submit
          </Button>
        </form>
      </div>
    </Container>
  );
}

CourseEdit.propTypes = {

};

export default CourseEdit;
