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

app.get('/user', (req, res) => {
  const user = {
    id: req.query.id,
    admin: req.body.isAdmin,
    course: null,
    name: null,
  };

  if (req.query.id === '') {
    if (req.session.dataValues.userId) {
      user.id = req.session.userId;
      db.User.findOne({
        where: {
          id: user.id,
        },
      })
        .then((data) => {
          user.admin = data.admin;
          user.name = data.name;
        });
    } else {
      res.sendStatus(203);
    }
  }

  if (user.id !== '') {
    if (user.admin) {
      db.Course.findAll()
        .then((result) => {
          user.course = result;
          res.send(user).status(200);
        })
        .catch(() => {
          res.sendStatus(500);
        });
    } else {
      db.User.findOne({
        where: {
          id: user.id,
        },
      })
        .then((data) => {
          user.name = data.name;
          user.admin = data.admin;
        })
        .then(() => {
          if (user.admin) {
            db.Course.findAll()
              .then((courses) => {
                user.course = courses;
                res.send(user).status(200);
              })
              .catch(() => {
                res.sendStatus(500);
              });
          } else {
            db.UserCourse.findAll({
              where: {
                userId: user.id,
              },
            })
              .then((result) => {
                user.course = result;
                // console.log('user back', user);
                res.send(user).status(200);
              })
              .catch((err) => {
                console.log(err);
                res.sendStatus(500);
              });
          }
        });
    }
  }
});

app.get('/student', (req, res) => {
  db.StudentCourse.findAll({
    where: {
      studentId: req.query.id,
    },
  })
    .then((result) => {
      res.send(result);
    })
    .catch(() => {
      res.sendStatus(500);
    });
});


// Sign up

// Student Sign up

app.post('/api/signup', (req, res) => {
  const {
    name,
    email,
    phone,
    password,
    cohort,
  } = req.body;
  const salt = utils.createRandom32String();
  const data = {
    name,
    email,
    phone,
    password: utils.createHash(password, salt),
    admin: false,
    salt,
    cohort,
  };

  return db.User.findOne({
    where: {
      email,
    },
  })
    .tap((user) => {
      // console.log(user);
      if (user) {
        throw user;
      }
    })
    .then(() => {
      console.log('creating');
      return db.User.create(data);
    })
    .then((results) => {
      console.log(results);
      const insertId = results.dataValues.id;
      return db.Session.update({ userId: insertId }, { where: { id: req.session.id } });
    })
    .then(() => {
      console.log('New Student signed up successfully');
      res.sendStatus(200);
    })
    .catch((user) => {
      console.log('catch', user);
      res.sendStatus(500);
    });
});

// Admin Sign up

app.post('/api/admin_signup', (req, res) => {
  // TODO: handle admin signup passcode

  const {
    name,
    email,
    phone,
    password,
  } = req.body;
  const salt = utils.createRandom32String();
  const data = {
    name,
    email,
    phone,
    password: utils.createHash(password, salt),
    admin: true,
    cohort: null,
    salt,
  };

  return db.User.findOne({
    where: {
      email,
    },
  })
    .tap((user) => {
      // console.log(user);
      if (user) {
        throw user;
      }
    })
    .then(() => {
      console.log('creating');
      return db.User.create(data);
    })
    .then((results) => {
      console.log(results);
      const insertId = results.dataValues.id;
      return db.Session.update({ userId: insertId }, { where: { id: req.session.id } });
    })
    .then(() => {
      console.log('New Admin signed up successfully');
      res.sendStatus(200);
    })
    .catch((user) => {
      console.log('catch', user);
      res.sendStatus(500);
    });
});

// log in

app.post('/api/login', (req, res) => {
  if (!req.body.email || !req.body.password) {
    // send back a 404 if input is not valid
    return res.sendStatus(404);
  }
  const { email, password } = req.body;
  let user;
  return db.User.findOne({
    where: {
      email,
    },
  })
    .then((userId) => {
      if (!userId) {
        throw userId;
      }
      return userId;
    })
    .then((data) => {
      user = { id: data.dataValues.id, admin: data.dataValues.admin, name: data.dataValues.name };
      return utils.compareHash(password, data.password, data.salt);
    })
    .then((bool) => {
      if (!bool) throw bool;
      return db.Session.update({ userId: user.id }, { where: { id: req.session.id } });
    })
    .then(() => {
      console.log('Successfully logged in!');
      res.send(user).status(200);
    })
    .catch((err) => {
      console.log('login error', err);
      res.sendStatus(500);
    });
});

// log out

app.get('/api/signout', (req, res) => db.Session.destroy({
  where: {
    hash: req.cookies.cslms,
  },
})
  .then(() => {
    res.clearCookie('cslms');
    res.sendStatus(200);
  })
  .error((error) => {
    res.status(500).send(error);
  }));

// listening port
app.listen(port, () => {
  console.log(`Listening port: ${port}`);
});
