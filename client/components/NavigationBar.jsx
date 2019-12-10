import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
}));

const NavigationBar = ({ name, loggedIn, signout }) => {
  const classes = useStyles();
  return (
    <AppBar position="relative">
      <Toolbar>
        <CameraIcon className={classes.icon} />
        <Typography variant="h6" color="inherit" noWrap>
          Code States
        </Typography>
        {loggedIn
          ? (
            <div>
              <Button disabled>
                {name}
              </Button>
              <Link to="/signout" onClick={signout}>
                <Button color="inherit">Sign Out</Button>
              </Link>
            </div>
          )
          : (
            <div>
              <Link to="/login">
                <Button color="inherit">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button color="inherit">Sign Up</Button>
              </Link>
            </div>
          )}
      </Toolbar>
    </AppBar>
  );
};

NavigationBar.propTypes = {

};

export default NavigationBar;
