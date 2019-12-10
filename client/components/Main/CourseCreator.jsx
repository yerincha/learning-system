/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import propTypes from 'prop-types';


// material-ui
import { Modal, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
}));

const CourseCreator = ({ handleChange, onClose, isClicked }) => {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={isClicked}
        onClose={onClose}
      >
        <div style={modalStyle} className={classes.paper}>
          <h2 id="simple-modal-title">New Course</h2>
          <TextField
            id="outlined-multiline-flexible"
            label="Multiline"
            multiline
            rowsMax="4"
            value={value}
            onChange={handleChange}
            variant="outlined"
          />
          <TextField
            id="outlined-multiline-static"
            label="Multiline"
            multiline
            rows="4"
            defaultValue="Default Value"
            variant="outlined"
          />
        </div>
      </Modal>
    </div>
  );
};


CourseCreator.propTypes = {

};

export default CourseCreator;
