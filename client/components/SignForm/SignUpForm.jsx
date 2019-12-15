/* eslint-disable no-useless-escape */
/* eslint-disable no-alert */
import React, { useState } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';

// material-ui
import {
  Avatar, Button, CssBaseline, TextField, Grid, Box, Typography, Container,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import Copyright from '../Copyright';
import useStyles from './useStyles';

const SignupForm = () => {
  const classes = useStyles();
  const [submitted, setSubmitted] = useState(false);
  const [values, setValues] = React.useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    password: '',
    Admin: false,
    passwordConfirmation: '',
    isEmailValid: true,
    isPhoneValid: true,
  });

  const isCellPhoneValidate = (phoneNum) => {
    const phoneRegExp = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;
    return phoneRegExp.test(phoneNum);
  };

  const isEmailValidate = (email) => {
    const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegExp.test(String(email).toLowerCase());
  };

  const handleChange = (name) => (event) => {
    if (name === 'phone') {
      const validationPhone = isCellPhoneValidate(event.target.value);
      setValues({
        ...values,
        [name]: event.target.value,
        isPhoneValid: validationPhone,
      });
    } else if (name === 'email') {
      const validationEmail = isEmailValidate(event.target.value);
      setValues({
        ...values,
        [name]: event.target.value,
        isEmailValid: validationEmail,
      });
    } else {
      setValues({
        ...values,
        [name]: event.target.value,
      });
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!values.isEmailValid) {
      alert('Your email address is invalid format');
    } else if (!values.isPhoneValid) {
      alert('Your phone number is invalid format');
    } else if (values.password !== values.passwordConfirmation) {
      alert('Please check your password. Password and password confirmation are not matching');
    } else {
      const data = {
        name: values.lastname + values.firstname,
        email: values.email,
        phone: values.phone,
        password: values.password,
        admin: values.admin,
      };
      axios.post('/api/signup', data)
        .then(() => {
          setSubmitted(true);
          alert('Welcome to be a new member. Plase sign in.');
        })
        .catch((err) => {
          if (err.response.status === 400) {
            alert('Please check your email. Your email address already exists.');
          } else {
            alert('Failed to sign up. Please try again.');
          }
        });
    }
  };


  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} onSubmit={onSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                onChange={handleChange('firstname')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                onChange={handleChange('lastname')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={handleChange('email')}
                helperText={(values.isEmailValid ? '' : 'Invalid email address.')}
                error={!values.isEmailValid}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handleChange('password')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="passwordConfirmation"
                label="Password Confirmation"
                type="password"
                id="passwordConfirmation"
                autoComplete="current-password"
                onChange={handleChange('passwordConfirmation')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="phone"
                label="Phone Number"
                type="phone"
                helperText={(values.isPhoneValid ? '' : 'Invalid phone number.')}
                id="formatted-text-mask-input"
                onChange={handleChange('phone')}
                value={values.phone}
                error={!values.isPhoneValid}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          {submitted ? <Redirect to="/signin" /> : null}
          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/signin">
                Already signed up? Please sign in.
              </Link>
            </Grid>
          </Grid>
          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/admin_signup"> Are you an admin? </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default SignupForm;
