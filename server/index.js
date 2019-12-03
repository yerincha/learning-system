const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('../db/index.js');


const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '../public/dist')));
app.use(bodyParser.json());
app.use(cors());


// Load data from db

app.get('/admin', (req, res) => {
  db.Course.findAll()
    .then((result) => {
      res.send(result[0].dataValues);
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

app.get('/student', (req, res) => {
  db.Course.findAll({
    where: {
      studentId: req.query.id
    }
  })
    .then((result) => {
      res.send(result);
    })
    .catch(() => {
      res.sendStatus(500);
    });
});


// Register

app.post('/admin', (req, res) => {
  const data = {

  };

  db.Users.create(data)
    .catch((err) => {
      console.log(`err: ${err}`);
      res.sendStatus(500);
    })
    .then(() => {
      console.log('New user is successfully registered');
      res.sendStatus(200);
    });
});

app.listen(port, () => {
  console.log(`Listening port: ${port}`);
});