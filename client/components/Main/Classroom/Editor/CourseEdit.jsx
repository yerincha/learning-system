/* eslint-disable no-alert */
import React from 'react';
import propTypes from 'prop-types';
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
      .then(() => {
        fetchCourseData();
      })
      .catch(() => {
        alert('Failed to update course');
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
};

CourseEdit.propTypes = {
  handleChange: propTypes.func.isRequired,
  courseTitle: propTypes.string.isRequired,
  courseSummary: propTypes.string.isRequired,
  selectedCourseItem: propTypes.shape({
    id: propTypes.number,
    title: propTypes.string,
    summary: propTypes.string,
  }),
  fetchCourseData: propTypes.func.isRequired,
  adminName: propTypes.string.isRequired,


};
CourseEdit.defaultProps = {
  selectedCourseItem: null,
};
export default CourseEdit;
