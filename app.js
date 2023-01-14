const express = require('express');
const app = express();
// const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const expressValidator = require("express-validator");
dotenv.config();
const db = require('./db');


// middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
const { check, validationResult } = require('express-validator');
app.use('/', indexRouter);
app.use('/users', usersRouter);


module.exports = app;


