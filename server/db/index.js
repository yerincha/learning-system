const Sequelize = require('sequelize');

const sequelize = new Sequelize('LMS', 'root', null, {
  host: 'localhost',
  dialect: 'mysql',
});

const User = sequelize.define('users', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  salt: Sequelize.STRING,
  cohort: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  admin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  password: Sequelize.STRING,
  phone: Sequelize.STRING,
});

const Session = sequelize.define('sessions', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  hash: Sequelize.STRING,
  userId: {
    type: Sequelize.INTEGER,
    references: {
      model: 'users',
      key: 'id',
    },
  },
});


const UserCourse = sequelize.define('userCourses', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
});

const Course = sequelize.define('courses', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  title: Sequelize.STRING,
  updatedAt: Sequelize.DATE,
  createdAt: Sequelize.DATE,
  madeBy: Sequelize.STRING,
  updatedBy: Sequelize.STRING,
});

const Container = sequelize.define('containers', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  updatedAt: Sequelize.DATE,
  createdAt: Sequelize.DATE,
  courseId: {
    type: Sequelize.INTEGER,
    references: {
      model: 'courses',
      key: 'id',
    },
  },
  published: { type: Sequelize.BOOLEAN, defaultValue: false },
});

const Content = sequelize.define('content', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  updatedAt: Sequelize.DATE,
  createdAt: Sequelize.DATE,
  containerId: {
    type: Sequelize.INTEGER,
    references: {
      model: 'courses',
      key: 'id',
    },
  },
  data: Sequelize.JSON,
  published: { type: Sequelize.BOOLEAN, defaultValue: false },
});


User.belongsToMany(Course, { through: UserCourse });
Course.belongsToMany(User, { through: UserCourse });

User.hasMany(Session, { foreignKey: 'userId' });
Session.belongsTo(User, { foreignKey: 'userId' });

Course.hasMany(Container, { foreignKey: 'courseId' });
Container.belongsTo(Course, { foreignKey: 'courseId' });

Container.hasMany(Content, { foreignKey: 'containerId' });
Content.belongsTo(Container, { foreignKey: 'containderId' });

// to test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });


User.sync();
UserCourse.sync();
Session.sync();
Course.sync();
Container.sync();
Content.sync();

module.exports = {
  User,
  Session,
  UserCourse,
  Course,
  Container,
  Content,
};
