import React, { useState } from 'react';
import propTypes from 'prop-types';
import Axios from 'axios';

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
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
  loggedIn, course, isAdmin, adminName, fetchCourseData,
}) => {
  const classes = useStyles();
  const [isClicked, setIsClicked] = useState(false);

  const [values, setValues] = React.useState({
    title: '',
    summary: '',
  });

  const handleClick = () => {
    setIsClicked(() => true);
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
      title: values.title, summary: values.summary, madeBy: adminName, updatedBy: adminName,
    })
      .then((res) => {
        console.log(res.data);
        setIsClicked(() => false);
        fetchCourseData();
      })
      .catch(() => {
        // console.log('not valid');
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
                      <Button variant="outlined" color="primary" onClick={handleClick}>
                        Create New Course
                      </Button>
                    )
                    : (
                      <Button variant="contained" color="primary">
                        <Link color="inherit" href="https://github.com/codestates">
                          Github Repositories
                        </Link>
                      </Button>
                    )}
                  {isClicked
                    ? (
                      <CourseCreator
                        isClicked={isClicked}
                        handleChange={handleChange}
                        onSubmit={onSubmit}
                        fetchCourseData={fetchCourseData}
                      />
                    )
                    : null}
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
        <Body loggedIn={loggedIn} course={course} isAdmin={isAdmin} />
      </main>
      {/* Footer */}
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          Something here to give the footer a purpose!
        </Typography>
        <Copyright />
      </footer>
      {/* End footer */}
    </div>
  );
};

Home.propTypes = {
  loggedIn: propTypes.bool.isRequired,
  isAdmin: propTypes.bool.isRequired,
  course: propTypes.arrayOf(propTypes.object),
  adminName: propTypes.string.isRequired,
  fetchCourseData: propTypes.func.isRequired,
};

Home.defaultProps = {
  course: [],
};

export default Home;
