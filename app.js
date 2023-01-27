const express = require("express");
const app = express();
// const cookieParser = require('cookie-parser');
const morgan = require("morgan");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const productRouter = require("./routes/product");
const movementRouter = require("./routes/movement");
 const authenticationRouter = require("./routes/authentication")
const { refresh } = require("./routes/authentication")
const expressValidator = require("express-validator");
const cookieParser = require("cookie-parser");

const db = require("./db");


// middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser())
//const { check, validationResult } = require('express-validator');
app.use(expressValidator());
app.use("/", indexRouter);
app.use("/user", refresh, userRouter);
app.use("/product", refresh, productRouter);
app.use("/movement", refresh, movementRouter);
app.use(authenticationRouter.router);


module.exports = app;
