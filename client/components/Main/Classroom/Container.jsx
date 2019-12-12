import React from 'react';
import propTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import {
  List,
  ListItem,
  Switch, Collapse,
  ListItemText, ListItemSecondaryAction, IconButton,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Content from './Content';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const Container = ({
  container, containerEditClick, contentEditClick, contentBodyClick, isAdmin, fetchCourseContent,
}) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [checked, setChecked] = React.useState([]);
  const handleClick = () => {
    setOpen(!open);
  };
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };
  return (
    <List key={container.title} className={classes.root}>
      <ListItem button onClick={handleClick}>
        {open ? <ExpandLess /> : <ExpandMore />}
        <ListItemText
          primary={container.title}
        />
        {isAdmin
          ? (
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="edit" size="small" onClick={() => containerEditClick(container)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" size="small">
                <DeleteIcon />
              </IconButton>
              <Switch
                edge="end"
                size="small"
                onChange={handleToggle(container.id)}
                checked={checked.indexOf(container.id) !== -1}
                color="primary"
              />
            </ListItemSecondaryAction>
          )
          : null}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List>
          {container.contents === undefined
            ? <div />
            : container.contents.map((content) => (
              <Content
                key={content.title}
                content={content}
                contentEditClick={contentEditClick}
                contentBodyClick={contentBodyClick}
                isAdmin={isAdmin}
                fetchCourseContent={fetchCourseContent}
              />
            ))}
        </List>
      </Collapse>
    </List>
  );
};

Container.propTypes = {
  container: propTypes.shape({
    id: propTypes.number.isRequired,
    title: propTypes.string,
    contents: propTypes.arrayOf(propTypes.object),
  }),
};

Container.defaultProps = {
  container: {
    id: 0,
  },
};
export default Container;
