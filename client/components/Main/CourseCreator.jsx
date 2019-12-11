/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import propTypes from 'prop-types';


// material-ui
import { Modal, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const getModalStyle = () => {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
};

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(1, 4, 3),
  },
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
}));

const CourseCreator = ({
  handleChange, onSubmit, isClicked, handleClose,
}) => {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={isClicked}
        onClose={handleClose}
      >
        <div style={modalStyle} className={classes.paper}>
          <h2 id="simple-modal-title">New Course</h2>
          <TextField
            id="outlined-multiline-flexible"
            label="Course Title"
            multiline
            rowsMax="4"
            // value={value}
            onChange={handleChange('title')}
            variant="outlined"
            margin="normal"
            fullWidth
          />
          <TextField
            id="outlined-multiline-static"
            label="Course Summary"
            multiline
            rows="4"
            margin="normal"
            variant="outlined"
            fullWidth
            onChange={handleChange('summary')}
          />
          <Button fullWidth variant="contained" color="primary" onClick={onSubmit}>
            Submit
          </Button>
        </div>
      </Modal>
    </div>
  );
};


CourseCreator.propTypes = {
  handleChange: propTypes.func.isRequired,
  onSubmit: propTypes.func.isRequired,
  isClicked: propTypes.bool.isRequired,
  handleClose: propTypes.func.isRequired,
};

export default CourseCreator;
