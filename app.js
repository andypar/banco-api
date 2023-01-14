var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const expressValidator = require("express-validator");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
mongoose.set('strictQuery', false);

var app = express();

// view engine setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', usersRouter);


module.exports = app;
