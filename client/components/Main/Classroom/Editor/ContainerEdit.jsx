import React, { useState } from 'react';
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

const ContainerEdit = ({
  handleChange, containerTitle, selectedContainer,
  adminName, fetchCourseData,
}) => {
  const classes = useStyles();

  const [contentTitle, setContentTitle] = React.useState('');
  const handleContentTitleChange = (e) => {
    setContentTitle(e.target.value);
  };

  const handleContainerEditClick = (e) => {
    e.preventDefault();
    Axios.put('/api/container', {
      title: containerTitle,
      updatedBy: adminName,
      id: selectedContainer.id,
    })
      .then((res) => {
        console.log('Content created', res.data);
        fetchCourseData();
      })
      .catch(() => {
        console.log('Oh no');
      });
  };

  const handleNewContentClick = () => {
    Axios.post('/api/content', {
      title: contentTitle,
      updatedBy: adminName,
      containerId: selectedContainer.id,
    })
      .then((res) => {
        console.log(res.data);
        fetchCourseData();
      })
      .then(() => {
        alert('New Content is created');
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
          Current Container Title Edit
        </Typography>
        <form className={classes.courseform} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            multiline
            fullWidth
            id="title"
            defaultValue={selectedContainer.title}
            name="containerTitle"
            autoFocus
            placeholder="Container title"
            onChange={handleChange('containerTitle')}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.coursesubmit}
            onClick={handleContainerEditClick}
          >
            Submit
          </Button>
          <Typography component="span" variant="h5">
            Add New Content
          </Typography>
          <TextField
            id="outlined"
            label="New Content Title"
            multiline
            rowsMax="4"
            onChange={handleContentTitleChange}
            variant="outlined"
            margin="normal"
            fullWidth
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.coursesubmit}
            onClick={handleNewContentClick}
          >
            New Content
          </Button>
        </form>
      </div>
    </Container>
  );
}

ContainerEdit.propTypes = {

};

export default ContainerEdit;
