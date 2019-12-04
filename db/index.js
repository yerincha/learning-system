const Sequelize = require('sequelize');

const sequelize = new Sequelize('LMS', 'root', null, {
  host: 'localhost',
  dialect: 'mysql',
});

const Admin = sequelize.define('admins', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    unique: true,
    validate: {
      isEmail: true
    },
  },
  phone: Sequelize.INTEGER,
});

const Student = sequelize.define('students', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    unique: true,
    validate: {
      isEmail: true
    },
  },
  phone: Sequelize.STRING,
  cohort: Sequelize.STRING,
  password: Sequelize.STRING,
  passwordConfirmation: Sequelize.STRING,
});

const StudentCourse = sequelize.define('studentCourses', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
});

const Course = sequelize.define('courses', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
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
  published: { type: Sequelize.BOOLEAN, defaultValue:false },
});


Student.belongsToMany(Course, { through: StudentCourse });
Course.belongsToMany(Student, { through: StudentCourse });

Course.hasMany(Container, { foreignKey: 'courseId' });
Container.belongsTo(Course, { foreignKey: 'courseId' });

Container.hasMany(Content, { foreignKey: 'containerId' });
Content.belongsTo(Container, { foreignKey: 'containderId' });

// to test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


Admin.sync();
Student.sync();
StudentCourse.sync();
Course.sync();
Container.sync();
Content.sync();

module.exports = {
  Admin,
  Student,
  StudentCourse,
  Course,
  Container,
  Content,
};