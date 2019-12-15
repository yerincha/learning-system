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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              {isValid
                ? null
                : (
                  <div>
                    <div> 이메일 주소, 혹은 비밀번호가 다릅니다.</div>
                  </div>
                )}
            </Grid>
            <Grid item>
              <div>
                <Link to="/signup"> 아직도 회원이 아니십니까? </Link>
              </div>
              <div>
                {signedIn ? <Redirect to="/" /> : <Redirect to="/signin" />}
              </div>
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
