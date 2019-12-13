# learning-system

## Introduction

This is a React Web Application of Learning Management System 

## Stack

> **Front-end: Javascript, React (webpack, Babel-loader)**<br>
> **Back-end: Node.js, Express** <br>
> **Database: MySQL**<br>
> **ORM: Sequelize**<br>
> <br>
> All of JS syntax in this project followed Airbnb JavaScript Style Guide by using ESLint<br>

## How To Use

```
# clone this repository
$ git clone https://github.com/lenacha/learning-system.git

# install dependencies
$ npm install

# compile/transpile files with webpack
$ npm run build

# run the app (run the server)
$ npm start
```

## Features
- Sign-in and Sign-up page.<br> 
  (Validating function email and phone(Korean number both local and mobile) is applied)<br>
- The admin Sign-up link is located at the bottom of the sign-up page. <br> 
**(Admin passcode is 'P@ssc@dE')**<br>
- At the sign-in page, both admin and student can sign-in.<br>
- The sign-in feature is created with cookies and sessions.<br>

### When you sign in with admin account
- You can see 'new course create' and 'dashboard button' on the main page.<br>
- You can generate passcode for the entering course, which is unique between students and courses. <br>
- you can create, edit, delete courses, containers, contents on the viewer.<br>
- When you click 'view' on the grid, you can enter to the viewer.<br>
- When you click the name of content, you can see the view mode of content for the student.<br>
- **When you create a new content, the content will be saved on the '/server/content_files' directory
  the name of file is an id of the content at the database. And when you edit, it will be overwrite.

### When you sign in with student account
- You will see the form of the entering passcode for opening a new course on the main page.<br>
- If you have courses with valid passcode on the database, you can see all the courses that you've added.<br>
- You also can enter the viewer with the view button on the grid, <br>
  but you can not edit anything with the courses, containers, contents. <br>
- You only can see the view mode of contents. <br>


# Requirements
> npm<br>
> Node.js<br>
> Git<br>