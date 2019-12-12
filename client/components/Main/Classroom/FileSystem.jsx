/* eslint-disable no-unused-expressions */
import React, { useState } from 'react';
import propTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  List, ListItem, ListItemSecondaryAction, IconButton, Drawer,
} from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

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
  handleChange, onContainerSubmit, selectedCourseData, isAdmin,
  selectedCourseItem, courseEditClick, containerEditClick, contentEditClick, contentBodyClick,
}) => {
  const classes = useStyles();
  const [isContainerAddClicked, setIsContainerAddClicked] = useState(false);

  const handleContainerAddClick = () => {
    setIsContainerAddClicked(true);
  };

  const handleClose = () => {
    setIsContainerAddClicked(false);
  };

  const listGenerate = () => (
    <div>
      {selectedCourseData === null
        ? (<div />)
        : selectedCourseData.map((container) => (
          <Container
            key={container.title}
            container={container}
            contentEditClick={contentEditClick}
            containerEditClick={containerEditClick}
            contentBodyClick={contentBodyClick}
            isAdmin={isAdmin}
          />
        ))}
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
          {isAdmin
            ? (
              <ListItem className={classes.title} button onClick={courseEditClick}>
                {selectedCourseItem.title}
              </ListItem>
            )
            : (
              <ListItem className={classes.title}>
                {selectedCourseItem.title}
              </ListItem>
            )}
          {isAdmin
            ? (
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="edit" size="medium" onClick={handleContainerAddClick}>
                  <AddCircleOutlineIcon />
                </IconButton>
              </ListItemSecondaryAction>
            )
            : null}
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
  selectedCourseData: propTypes.arrayOf(propTypes.object),
  handleChange: propTypes.func.isRequired,
  onContainerSubmit: propTypes.func.isRequired,
  selectedCourseItem: propTypes.objectOf(propTypes.string),
  courseEditClick: propTypes.func.isRequired,
  containerEditClick: propTypes.func.isRequired,
  contentEditClick: propTypes.func.isRequired,
};

FileSystem.defaultProps = {
  selectedCourseData: null,
  selectedCourseItem: null,
};

export default FileSystem;
