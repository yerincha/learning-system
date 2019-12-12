const { Op } = require('sequelize');
const express = require('express');
const fs = require('fs');
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
  // console.log('GET user -> session', req.session);
  if (!req.session.dataValues.userId) {
    res.sendStatus(203);
  } else {
    const user = {
      id: req.session.dataValues.userId,
      admin: null,
      name: null,
    };

    db.User.findOne({
      where: {
        id: user.id,
      },
    })
      .then((loadedUser) => {
        user.admin = loadedUser.admin;
        user.name = loadedUser.name;
        res.send(user).status(200);
      })
      .catch(() => {
        res.sendStatus(500);
      });
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
      if (user) {
        throw user;
      }
    })
    .then(() => db.User.create(data))
    .then((results) => {
      const insertId = results.dataValues.id;
      return db.Session.update({ userId: insertId }, { where: { id: req.session.id } });
    })
    .then(() => {
      console.log('New Student signed up successfully');
      res.sendStatus(200);
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

// Admin Sign up

app.post('/api/admin_signup', (req, res) => {
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
      if (user) {
        throw user;
      }
    })
    .then(() => db.User.create(data))
    .then((results) => {
      const insertId = results.dataValues.id;
      return db.Session.update({ userId: insertId }, { where: { id: req.session.id } });
    })
    .then(() => {
      console.log('New Admin signed up successfully');
      res.sendStatus(200);
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

// Sign in

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
    .catch(() => {
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


// Course
app.get('/api/courses', (req, res) => {
  const returningCourses = [];
  if (req.query.isAdmin === 'true') {
    db.Course.findAll()
      .then((data) => {
        data.map((courseData) => returningCourses.push(courseData.dataValues));
        return returningCourses;
      })
      .then((data) => {
        res.send(data).status(200);
      })
      .catch(() => {
        res.sendStatus(500);
      });
  } else {
    db.UserCourse.findAll({
      where: {
        userId: req.query.id,
      },
    })
      .then((data) => {
        const courseIds = data.reduce((acc, cur) => {
          acc.push(cur.dataValues.courseId);
          return acc;
        }, []);

        db.Course.findAll({
          where: {
            id: {
              [Op.or]: courseIds,
            },
          },
        })
          .then((coursesData) => {
            coursesData.map((courseData) => returningCourses.push(courseData.dataValues));
            res.send(returningCourses).status(200);
          })
          .catch(() => {
            res.sendStatus(500);
          });
      })
      .catch(() => {
        res.sendStatus(500);
      });
  }
});

app.post('/api/course', (req, res) => {
  db.Course.create(req.body)
    .then(() => {
      res.sendStatus(200);
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

// Course update

app.put('/api/course', (req, res) => {
  db.Course.update({
    title: req.body.title,
    summary: req.body.summary,
    updatedBy: req.body.updatedBy,
  }, {
    where: {
      id: req.body.id,
    },
  })
    .then(() => {
      res.sendStatus(200);
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

// find selected course

app.get('/api/course', (req, res) => {
  db.Container.findAll({
    where: {
      courseId: req.query.id,
    },
  }).then((containers) => {
    const containerIds = containers.reduce((acc, cur) => {
      acc.push(cur.id);
      return acc;
    }, []);
    db.Content.findAll({
      where: {
        containerId: {
          [Op.or]: containerIds,
        },
      },
    }).then((contents) => {
      const containerIdAndContentsObj = {};

      for (let i = 0; i < contents.length; i += 1) {
        const content = contents[i].dataValues;
        if (containerIdAndContentsObj[content.containerId] === undefined) {
          containerIdAndContentsObj[content.containerId] = [content];
        } else {
          containerIdAndContentsObj[content.containerId].push(content);
        }
      }


      const newContainers = [];
      for (let i = 0; i < containers.length; i += 1) {
        const container = containers[i].dataValues;
        container.contents = containerIdAndContentsObj[container.id];
        newContainers.push(container);
      }
      res.send(newContainers).status(200);
    }).catch(() => {
      res.sendStatus(500);
    });
  }).catch(() => {
    res.sendStatus(500);
  });
});

// Container

app.post('/api/container', (req, res) => {
  db.Container.create(req.body)
    .then(() => {
      res.sendStatus(200);
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

// container update

app.put('/api/container', (req, res) => {
  db.Container.update({
    title: req.body.title,
    updatedBy: req.body.updatedBy,
  }, {
    where: {
      id: req.body.id,
    },
  })
    .then(() => {
      res.sendStatus(200);
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

// container delete

app.delete('/api/container', (req, res) => {
  db.Content.findAll({
    where: {
      containerId: req.query.id,
    },
  })
    .then((contents) => {
      // Delete Files
      const contentIds = contents.reduce((acc, cur) => {
        acc.push(cur.dataValues.id);
        return acc;
      }, []);

      contentIds.map((id) => {
        const filePath = `server/content_files/${id}.md`;
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        return null;
      });

      return db.Content.destroy({
        where: {
          id: {
            [Op.or]: contentIds,
          },
        },
      });
    })
    .then(() => db.Container.destroy({
      where: {
        id: req.query.id,
      },
    }))
    .then(() => {
      res.sendStatus(200);
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

// New Content create
app.post('/api/content', (req, res) => {
  db.Content.create(req.body)
    .then(() => {
      res.sendStatus(200);
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

// Content File Loading
app.get('/api/content_file', (req, res) => {
  fs.readFile(`server/content_files/${req.query.id}.md`, (err, data) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.send(data).status(200);
    }
  });
});

// Content File Save
app.post('/api/content_file', (req, res) => {
  fs.writeFile(`server/content_files/${req.body.id}.md`, req.body.body, (err) => {
    if (err) {
      res.sendStatus(500);
      return;
    }
    res.sendStatus(200);
  });
});

// Delete Content
app.delete('/api/content', (req, res) => {
  const filePath = `server/content_files/${req.query.id}.md`;
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        res.sendStatus(500);
      } else {
        db.Content.destroy({
          where: {
            id: req.query.id,
          },
        })
          .then(() => {
            res.sendStatus(200);
          })
          .catch(() => {
            res.sendStatus(500);
          });
      }
    });
  } else {
    db.Content.destroy({
      where: {
        id: req.query.id,
      },
    })
      .then(() => {
        res.sendStatus(200);
      })
      .catch(() => {
        res.sendStatus(500);
      });
  }
});


// listening port
app.listen(port, () => {
  console.log(`Listening port: ${port}`);
});
