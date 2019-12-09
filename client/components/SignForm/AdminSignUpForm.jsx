/* eslint-disable no-alert */
import React, { useState } from 'react';
import axios from 'axios';

import { Redirect, Link } from 'react-router-dom';

// material-ui
import {
  Avatar, Button, CssBaseline, TextField, Grid, Box, Typography, Container,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import useStyles from './useStyles';
import Copyright from './Copyright';

const AdminSignup = () => {
  const classes = useStyles();
  const [submitted, setSubmitted] = useState(false);
  const [values, setValues] = React.useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    passcode: '',
    Admin: true,
    password: '',
    passwordConfirmation: '',
  });

  const handleChange = (name) => (event) => {
    setValues({
      ...values,
      [name]: event.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (values.password !== values.passwordConfirmation) {
      alert('비밀번호와 비밀번호 확인이 맞지 않습니다. 비밀번호를 다시 확인해주세요');
    } else if (values.passcode !== 'P@ssc@dE') {
      alert('관리자 패스코드가 틀렸습니다');
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
          alert('관리자 회원 가입을 환영합니다. 로그인 해 주세요.');
        })
        .catch(() => {
          alert('이미 등록된 이메일입니다. 다시 시도해주세요.');
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
          Admin Sign up
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
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="phone"
                label="Phone Number"
                type="password"
                id="formatted-text-mask-input"
                onChange={handleChange('phone')}
                value={values.textmask}
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
                onChange={handleChange('passwordConfirmation')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="passcode"
                label="Admin Passcode"
                type="password"
                id="passcode"
                onChange={handleChange('passcode')}
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
          {submitted ? <Redirect to="/login" /> : null}
          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/login">
                이미 가입하셨습니까? 여기서 로그인 해 주세요
              </Link>
            </Grid>
          </Grid>
          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/signup"> 관리자가 아니십니까? </Link>
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

export default AdminSignup;
