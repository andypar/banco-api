const express = require("express");
const app = express();
// const cookieParser = require('cookie-parser');
const morgan = require("morgan");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const productRouter = require("./routes/product");
const expressValidator = require("express-validator");

const db = require("./db");

// middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
//const { check, validationResult } = require('express-validator');
app.use(expressValidator());
app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/product", productRouter);

module.exports = app;
