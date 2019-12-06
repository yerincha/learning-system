const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const Auth = require('./middleware/auth');
const db = require('./db/index');
const utils = require('./lib/hashUtils');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, '../public/dist')));

app.use(require('./middleware/cookieParser'));
app.use(Auth.createSession);

// Load data from db

app.get('/admin', (req, res) => {
  db.Course.findOne()
    .then((result) => {
      res.send(result[0].dataValues);
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

app.get('/student', (req, res) => {
  db.StudentCourse.findOne({
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


// Sign up

// Admin Sign up
app.post('/api/admin_signup', (req, res) => {

  // TODO: handle admin signup passcode 

  const { name, email, phone, password } = req.body;
  const salt = utils.createRandom32String();
  const data = {
    name,
    email,
    phone,
    password: utils.createHash(password, salt),
    admin: true,
    salt,
  };


  return db.User.findOne({
    where: {
      email,
    },
  })
    .tap(user => {
      console.log(user)
      if (user.length !== 0) {
        throw user;
      }
    })
    .then(user => {
      console.log('creating')
      return db.User.create(data);
    })
    .then((results) => {
      console.log(results);
      var insertId = results.dataValues.id;
      return db.Session.update({ userId: insertId }, { where: { id: req.session.id } });
    })
    .then(user => {
      console.log('New Admin signed up successfully');
      res.redirect('/');
    })
    .catch(user => {
      console.log('catch', user)
      res.redirect('/admin_signup')
    });
});

// Student sign up
app.post('/api/signup', (req, res) => {

  const { name, email, phone, password, cohort } = req.body;
  const data = {
    name,
    email,
    phone,
    password,
    cohort,
  };

  return db.User.findOne({
    where: {
      email,
    },
  })
    .tap(user => {
      // console.log(user)
      if (user.length !== 0) {
        throw user;
      }
    })
    .then(user => {
      // console.log('creating')
      return db.User.create(data);
    })
    .then((results) => {
      // console.log(results);
      var insertId = results.dataValues.id;
      return db.Session.update({ userId: insertId }, { where: { id: req.session.id } });
    })
    .then(user => {
      console.log('New student signed up successfully');
      res.redirect('/');
    })
    .catch(user => {
      console.log('catch', user)
      res.redirect('/signup')
    });
});

// log in

app.post('/api/login', (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    // send back a 404 if input is not valid
    return res.sendStatus(404);
  }
  const { email, password } = req.body;
  return db.User.findOne({
      where: {
        email: email,
      }
    })
    .then(user => {
      if (!user) {
        throw user;
      }
      return user;
    })
    .then(data => {
      return utils.compareHash(password, data.password, data.salt);
    })
    .then(bool => {
      if (!bool) throw bool;
      console.log('Successfully logged in!')
    })
    .catch(user => {
      console.log('login error')
      // res.redirect('/login')
    });
})


// listening port
app.listen(port, () => {
  console.log(`Listening port: ${port}`);
});