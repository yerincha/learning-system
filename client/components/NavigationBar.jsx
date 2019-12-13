import React from 'react';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    ...theme.typography.button,
    padding: theme.spacing(1),
    fontSize: '13px',
  },
  grow: {
    flexGrow: 1,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  sign: {
    align: 'right',
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  button: {
    marginTop: '-2px',
  },
}));

const NavigationBar = ({ name, loggedIn, signout }) => {
  const classes = useStyles();
  return (
    <AppBar className={classes.appBar} color="default" position="relative">
      <Toolbar>
        <Link to="/">
          <Typography variant="h6" color="textPrimary" className={classes.title} noWrap>
            CODE STATES
          </Typography>
        </Link>
        <div className={classes.grow} />
        <div className={classes.sectionDesktop}>
          {loggedIn
            ? (
              <div className={classes.root}>
                {name}
                <Link to="/signout" onClick={signout}>
                  <Button className={classes.button} color="default">Sign Out</Button>
                </Link>
              </div>
            )
            : (
              <div>
                <Link to="/login">
                  <Button color="default">Sign In</Button>
                </Link>
                <Link to="/signup">
                  <Button color="default">Sign Up</Button>
                </Link>
              </div>
            )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

NavigationBar.propTypes = {
  name: propTypes.string.isRequired,
  loggedIn: propTypes.bool.isRequired,
  signout: propTypes.func.isRequired,
};

export default NavigationBar;
