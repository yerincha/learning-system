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

// Load All Students

app.get('/api/student_all', (req, res) => {
  db.User.findAll({
    where: {
      admin: 0,
    },
  })
    .then((data) => {
      const students = data.map((c) => c.dataValues);
      res.send(students).status(200);
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
  } = req.body;
  const salt = utils.createRandom32String();
  const data = {
    name,
    email,
    phone,
    password: utils.createHash(password, salt),
    admin: false,
    salt,
  };

  return db.User.findOne({
    where: {
      email,
    },
  })
    .tap((user) => {
      if (user) {
        throw new Error('already exists');
      }
    })
    .then(() => db.User.create(data))
    .then(() => {
      console.log('New Student signed up successfully');
      res.sendStatus(200);
    })
    .catch((err) => {
      if (err.message === 'already exists') {
        res.sendStatus(400);
      } else {
        res.sendStatus(500);
      }
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
    salt,
  };

  return db.User.findOne({
    where: {
      email,
    },
  })
    .tap((user) => {
      if (user) {
        throw new Error('already exists');
      }
    })
    .then(() => db.User.create(data))
    .then(() => {
      console.log('New Admin signed up successfully');
      res.sendStatus(200);
    })
    .catch((err) => {
      if (err.message === 'already exists') {
        res.sendStatus(400);
      } else {
        res.sendStatus(500);
      }
    });
});

// Sign in

app.post('/api/signin', (req, res) => {
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
      console.log('Successfully signed in!');
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
        signedUp: true,
      },
    })
      .then((data) => {
        const courseIds = data.reduce((acc, cur) => {
          acc.push(cur.dataValues.courseId);
          return acc;
        }, []);

        if (courseIds.length === 0) {
          res.send([]).status(200);
        } else {
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
        }
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
  },
  {
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
    order: [
      ['index', 'ASC'],
    ],
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
      order: [
        ['index', 'ASC'],
      ],
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

// Load All Courses

app.get('/api/course_all', (req, res) => {
  db.Course.findAll()
    .then((data) => {
      const courses = data.map((c) => c.dataValues);
      res.send(courses).status(200);
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

// Delete Course
app.delete('/api/course', (req, res) => {
  const courseId = req.query.id;
  let containerIds = null;

  db.Container.findAll({
    where: {
      courseId,
    },
  })
    .then((containers) => {
      containerIds = containers.map((container) => container.id);

      return db.Content.findAll({
        where: {
          containerId: {
            [Op.or]: containerIds,
          },
        },
      });
    })
    .then((contents) => {
      const contentIds = contents.map((content) => content.id);

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
        id: {
          [Op.or]: containerIds,
        },
      },
    }))
    .then(() => db.Course.destroy({
      where: {
        id: courseId,
      },
    }))
    .then(() => {
      res.sendStatus(200);
    })
    .catch(() => {
      res.sendStatus(500);
    });
});


// Container

app.post('/api/container', (req, res) => {
  db.Container.findAll({
    where: {
      courseId: req.body.courseId,
    },
    order: [
      ['index', 'DESC'],
    ],
    limit: 1,
  })
    .then((dbRes) => {
      // console.log(dbRes);
      let lastIndex = 0;
      if (dbRes.length > 0) {
        lastIndex = dbRes[0].dataValues.index + 1;
      }

      req.body.index = lastIndex;

      return db.Container.create(req.body);
    })
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
  },
  {
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

// Update Container Published

app.put('/api/container_published', (req, res) => {
  db.Container.update({
    published: req.body.published,
  },
  {
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

// Update Container Order
app.put('/api/container_update_index', (req, res) => {
  const allUpdates = req.body.map((item) => db.Container.update({
    index: item.index,
  },
  {
    where: {
      id: item.id,
    },
  }));
  Promise.all(allUpdates).then(() => {
    // console.log('Update Index Finished');
    res.sendStatus(200);
  })
    .catch(() => {
      res.sendStatus(500);
    });
});

// New Content create
app.post('/api/content', (req, res) => {
  db.Content.findAll({
    where: {
      containerId: req.body.containerId,
    },
    order: [
      ['index', 'DESC'],
    ],
    limit: 1,
  })
    .then((dbRes) => {
      let lastIndex = 0;
      if (dbRes.length > 0) {
        lastIndex = dbRes[0].dataValues.index + 1;
      }

      req.body.index = lastIndex;

      return db.Content.create(req.body);
    })
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
  db.Content.update({
    title: req.body.title,
  },
  {
    where: {
      id: req.body.id,
    },
  })
    .then(() => {
      const fileDir = 'server/content_files';
      if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir);
      }
      fs.writeFile(`${fileDir}/${req.body.id}.md`, req.body.body, (err) => {
        if (err) {
          res.sendStatus(500);
          return;
        }
        res.sendStatus(200);
      });
    })
    .catch(() => {
      res.sendStatus(500);
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

// Update Content Published
app.put('/api/content_published', (req, res) => {
  db.Content.update({
    published: req.body.published,
  },
  {
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

// Update Content Order
app.put('/api/content_update_index', (req, res) => {
  const allUpdates = req.body.map((item) => db.Content.update({
    index: item.index,
  },
  {
    where: { id: item.id },
  }));
  Promise.all(allUpdates).then(() => {
    // console.log('Update Index Finished');
    res.sendStatus(200);
  })
    .catch(() => {
      res.sendStatus(500);
    });
});

// Create User-Course passcode

app.post('/api/code', (req, res) => {
  db.UserCourse.findOne({
    where: {
      userId: req.body.userId,
      courseId: req.body.courseId,
    },
  })
    .then((data) => {
      if (data !== null) {
        res.sendStatus(400);
      } else {
        db.UserCourse.create({
          code: req.body.code,
          userId: req.body.userId,
          courseId: req.body.courseId,
        })
          .then(() => {
            res.send(req.body.code).status(200);
          })
          .catch(() => {
            res.sendStatus(500);
          });
      }
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

// Get all User-Course
app.get('/api/code', (req, res) => {
  db.UserCourse.findAll()
    .then((result) => {
      const userCourses = result.map((data) => data.dataValues);
      res.send(userCourses).status(200);
    });
});

// course register
app.put('/api/register', (req, res) => {
  db.UserCourse.findOne({
    where: {
      userId: req.body.userId,
      code: req.body.code,
    },
  })
    .then((result) => {
      if (!result) {
        // No match found
        res.sendStatus(400);
      } else {
        // Found Matching
        db.UserCourse.update({
          signedUp: true,
        },
        {
          where: {
            userId: req.body.userId,
            code: req.body.code,
          },
        })
          .then(() => {
            res.sendStatus(200);
          })
          .catch(() => {
            res.sendStatus(500);
          });
      }
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

// listening port
app.listen(port, () => {
  console.log(`Listening port: ${port}`);
});
