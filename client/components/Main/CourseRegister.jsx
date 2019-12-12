import React from 'react';
import {
  Button, CssBaseline, TextField, Typography, Container,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Axios from 'axios';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const CourseRegister = ({ userId, fetchCourseData }) => {
  const classes = useStyles();
  const [codeField, setCodeField] = React.useState('');

  const register = (e) => {
    e.preventDefault();
    Axios.put('/api/register', {
      userId,
      code: codeField,
    })
      .then(() => {
        fetchCourseData();
      })
      .then(() => {
        alert('Wecome to the new course');
      })
      .catch((err) => {
        if (err.response.code === 400) {
          alert('The code is wrong. Check it again');
        } else {
          alert('Something went wrong.');
        }
      });
  };

  const handleChange = (e) => {
    setCodeField(e.target.value);
  };
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h2" variant="h3" align="center" color="textPrimary" gutterBottom>
          새로운 코스 신청
        </Typography>
        <Typography color="textSecondary" variant="subtitle1" align="center" paragraph>
          관리자로부터 전달받은 코스 코드를 입력해주세요.
        </Typography>

        <form className={classes.form} onSubmit={register} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="Course code"
            label="Course code"
            type="text"
            id="courseCode"
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Submit
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default CourseRegister;
