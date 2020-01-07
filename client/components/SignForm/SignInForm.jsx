/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import propTypes from 'prop-types';


// material-ui
import {
  Avatar, Button, CssBaseline, TextField, Grid, Box, Typography, Container,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import Copyright from '../Copyright';
import useStyles from './useStyles';

const SignInForm = ({ signedIn, signIn }) => {
  const classes = useStyles();
  const [isValid, setIsValid] = useState(true);
  const [values, setValues] = React.useState({
    email: '',
    password: '',
  });

  const handleChange = (name) => (event) => {
    setValues({
      ...values,
      [name]: event.target.value,
    });
  };


  const onSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/Signin', { email: values.email, password: values.password })
      .then((res) => {
        signIn(res.data);
      })
      .catch(() => {
        setIsValid(false);
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} onSubmit={onSubmit} noValidate>
          <Grid item xs>
            {isValid
              ? null
              : (
                <div>
                  <h6 style={{ color: 'red', textAlign: 'center' }}>Email address or password is wrong.</h6>
                  <h6 style={{ color: 'red', textAlign: 'center' }}>Please try again.</h6>

                  {/* <div> </div> */}
                </div>
              )}
          </Grid>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            placeholder="Password"
            onChange={handleChange('email')}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            placeholder="Password"
            onChange={handleChange('password')}
          />
          <Grid container>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container justify="flex-end">
              <Grid item>
                <div>
                  <Link to="/signup"> Still not a member? Please sign up!</Link>
                </div>
                <div>
                  {signedIn ? <Redirect to="/" /> : <Redirect to="/signin" />}
                </div>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};


SignInForm.propTypes = {
  signedIn: propTypes.bool.isRequired,
  signIn: propTypes.func.isRequired,
};

export default SignInForm;
