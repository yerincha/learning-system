/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  List, ListItem, ListItemSecondaryAction, IconButton, Hidden, Drawer
} from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Axios from 'axios';

import Container from './Container';
import CourseCreator from './CourseCreator';

const drawerWidth = 300;
const useStyles = makeStyles((theme) => ({
  menu: {
    display: 'flex',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  toolbar: theme.mixins.toolbar,
  title: {
    fontSize: '20px',
  },
}));


const FileSystem = ({
  course, selectedCourse, handleChange, onCourseSubmit,
}) => {
  const classes = useStyles();
  const [isClicked, setIsClicked] = useState(false);

  const [selectedCourseData, setSelectedCourseData] = React.useState(null);

  const fetchCourseContent = () => {
    Axios.get(`/api/course?id=${selectedCourse}`)
      .then((data) => {
        console.log(data);
        setSelectedCourseData(data.data);
      });
  };

  useEffect(() => {
    fetchCourseContent();
  }, []);

  const handleClick = () => {
    setIsClicked(true);
  };

  const handleClose = () => {
    setIsClicked(false);
  };

  console.log(selectedCourseData);

  const listGenerate = () => (
    <div>
      {selectedCourseData === null
        ? (<div />)
        : selectedCourseData.map((container) => (
          <Container key={container.title} container={container} />
        ))}
    </div>
  );

  return (
    <div className={classes.menu}>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        <div>
          <br />
          <br />
          <br />
          <br />
          <List className={classes.toolbar}>
            <ListItem className={classes.title} button>
              {course[0].title}
            </ListItem>
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="edit" size="medium" onClick={handleClick}>
                <AddCircleOutlineIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </List>
          {listGenerate()}
          {isClicked
            ? (
              <CourseCreator
                isClicked={isClicked}
                handleChange={handleChange}
                onSubmit={onCourseSubmit}
                handleClose={handleClose}
              />
            )
            : null}
        </div>
      </Drawer>
    </div>
  );
};

FileSystem.propTypes = {
  course: propTypes.arrayOf(propTypes.object),
  selectedCourse: propTypes.number.isRequired,
  handleChange: propTypes.func.isRequired,
  onCourseSubmit: propTypes.func.isRequired,
};

FileSystem.defaultProps = {
  course: [],
};

export default FileSystem;
