import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';
import Axios from 'axios';

import {
  Button, CssBaseline, Grid, Typography, Container,
} from '@material-ui/core';
import Linkto from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';

import Copyright from '../Copyright';
import Body from './Body';
import CourseCreator from './CourseCreator';

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));


const Home = ({
  loggedIn, course, isAdmin, adminName, fetchCourseData, selectedCourse, onViewClick, userId,
}) => {
  const classes = useStyles();
  const [isClicked, setIsClicked] = useState(false);

  const [values, setValues] = React.useState({
    title: '',
    summary: '',
  });

  const handleClick = () => {
    setIsClicked(true);
  };

  const handleClose = () => {
    setIsClicked(false);
  };

  const handleChange = (name) => (event) => {
    setValues({
      ...values,
      [name]: event.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    Axios.post('/api/course', {
      title: values.title,
      summary: values.summary,
      madeBy: adminName,
      updatedBy: adminName,
      image: 'https://source.unsplash.com/random',
    })
      .then(() => {
        setIsClicked(() => false);
        fetchCourseData();
      })
      .catch(() => {
        alert('Failed to load courses');
      });
  };
  return (
    <div>
      <CssBaseline />
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              LEARN CODESTATES
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              IMMERSION 개발에만 몰두할 수 있는 환경
              CURRICULUM 실무를 위해 구성된 체계적인 커리큘럼
              COMMUNITY 협업하고 소통하는 커뮤니티
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  {isAdmin
                    ? (
                      <div>
                        <Link to="/dashboard">
                          <Button variant="contained" color="primary">
                            Go to Dash Board
                          </Button>
                        </Link>
                        <Button variant="outlined" color="primary" onClick={handleClick}>
                          Create New Course
                        </Button>
                      </div>
                    )
                    : (
                      <Button variant="contained" color="primary">
                        <Linkto color="inherit" href="https://github.com/codestates">
                          Github Repositories
                        </Linkto>
                      </Button>
                    )}
                  {isClicked
                    ? (
                      <CourseCreator
                        isClicked={isClicked}
                        handleChange={handleChange}
                        onSubmit={onSubmit}
                        fetchCourseData={fetchCourseData}
                        handleClose={handleClose}
                      />
                    )
                    : null}
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
        <Body
          loggedIn={loggedIn}
          course={course}
          isAdmin={isAdmin}
          selectedCourse={selectedCourse}
          onViewClick={onViewClick}
          fetchCourseData={fetchCourseData}
          userId={userId}
        />
      </main>
      <footer className={classes.footer}>
        <Copyright />
      </footer>
    </div>
  );
};

Home.propTypes = {
  loggedIn: propTypes.bool.isRequired,
  isAdmin: propTypes.bool.isRequired,
  course: propTypes.objectOf(propTypes.object),
  adminName: propTypes.string.isRequired,
  fetchCourseData: propTypes.func.isRequired,
  selectedCourse: propTypes.number.isRequired,
  onViewClick: propTypes.func.isRequired,
  userId: propTypes.number.isRequired,
};

Home.defaultProps = {
  course: {},
};

export default Home;
