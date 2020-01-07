import React from 'react';
import { Link, Typography } from '@material-ui/core';

const Copyright = () => (
  <Typography variant="body2" color="textSecondary" align="center">
    {'Copyright © '}
    <Link color="inherit" href="https://www.codestates.com//">
      {'Yerin\'s LMS '}
    </Link>
    {new Date().getFullYear()}
    .
  </Typography>
);

export default Copyright;
