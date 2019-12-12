import React from 'react';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';
import Axios from 'axios';

import {
  Button, Card, CardActions, CardContent, CardMedia, CssBaseline, Grid, Typography, Container, IconButton,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
}));

const CardGrid = ({ course, onViewClick, isAdmin, fetchCourseData }) => {
  const classes = useStyles();

  const handleCourseDelete = (cardId) => {
    const isOkay = confirm('Do you want to delete this course?');
    if (isOkay) {
      Axios.delete('/api/course', {
        params: {
          id: cardId,
        },
      })
        .then((res) => {
          if (res.status === 200) {
            fetchCourseData();
          }
        })
        .catch(() => {
          alert('Failed to delete this course');
        });
    }
  }

  return (
    <div>
      <CssBaseline />
      <main>
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {course.map((card) => (
              <Grid item key={card.id} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image="https://source.unsplash.com/random"
                    title="Image title"
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {card.title}
                    </Typography>
                    <Typography>
                      {card.summary}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Link to="/classroom">
                      <Button size="small" color="primary" onClick={() => onViewClick(card.id)}>
                        View
                      </Button>
                    </Link>
                    {
                      isAdmin
                        ? (
                          <IconButton edge="end" aria-label="delete" size="small" onClick={() => handleCourseDelete(card.id)}>
                            <DeleteIcon />
                          </IconButton>
                        )
                        : null
                    }
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </div>
  );
};

CardGrid.propTypes = {
  course: propTypes.arrayOf(propTypes.object),
  onViewClick: propTypes.func.isRequired,
};

CardGrid.defaultProps = {
  course: [],
};

export default CardGrid;
