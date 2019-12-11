/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  List, ListItem, ListItemSecondaryAction, IconButton, Drawer,
} from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Axios from 'axios';

import Container from './Container';
import ContainerCreator from './Editor/ContainerCreator';


const drawerWidth = 300;
const useStyles = makeStyles((theme) => ({
  classroom: {
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
  handleChange, onContainerSubmit, selectedCourseData,
  selectedCourseItem, courseEditClick, containerEditClick, contentEditClick,
}) => {
  const classes = useStyles();
  const [isContainerAddClicked, setIsContainerAddClicked] = useState(false);

  const handleClick = () => {
    setIsContainerAddClicked(true);
  };

  const handleClose = () => {
    setIsContainerAddClicked(false);
  };

  const listGenerate = () => (
    <div>
      {selectedCourseData === null
        ? (<div />)
        : selectedCourseData.map((container) => (<Container key={container.title} container={container} contentEditClick={contentEditClick} containerEditClick={containerEditClick} />))}
    </div>
  );
  return (

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
          <ListItem className={classes.title} button onClick={courseEditClick}>
            {selectedCourseItem.title}
          </ListItem>
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="edit" size="medium" onClick={handleClick}>
              <AddCircleOutlineIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </List>
        {listGenerate()}
        {isContainerAddClicked
          ? (
            <ContainerCreator
              isClicked={isContainerAddClicked}
              handleChange={handleChange}
              onContainerSubmit={onContainerSubmit}
              handleClose={handleClose}
            />
          )
          : null}
      </div>
    </Drawer>

  );
};

FileSystem.propTypes = {
  course: propTypes.arrayOf(propTypes.object),
  selectedCourseData: propTypes.arrayOf(propTypes.object),
  handleChange: propTypes.func.isRequired,
  onContainerSubmit: propTypes.func.isRequired,
};

FileSystem.defaultProps = {
  course: [],
  // onContainerSubmit: null,
  selectedCourseData: null,
};

export default FileSystem;
