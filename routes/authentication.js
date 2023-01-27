const express = require("express");
const { models } = require("../db");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();


router.post("/login", signIn);
router.post("/logout", logout);


async function signIn(req, res, next) {
  console.log(`Creating user token`);

  if (!req.body.username) {
    res.status(400).send("Missing email parameter");
  }

  if (!req.body.password) {
    res.status(404).send("Missing password parameter");
  }

  try {
    const user = await models.User.findOne(
      { username: req.body.username },
      "+password"
    );

    if (!user) {
      res.status(404).send("user not found");
    }

    console.log("Checking user password");
    const result = await user.checkPassword(req.body.password);

    delete user.password;

    if (!result.isOk) {
      res.status(404).send("User password is invalid");
    }

    const payload = {
      _id: user._id,
      username: user.username,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN * 1000,
    });

    res.cookie("token", token, { maxAge: process.env.JWT_EXPIRES_IN * 1000 });
    res.status(201).send({ token: `Bearer ${token}`, user: payload });
  } catch (err) {
    next(err);
  }
}

async function validateExistingEmail(user) {
  try {
    const useremail = await models.User.findOne({ email: user.email });
    if (useremail) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    next(err);
  }
}


const welcome = async (req, res, next) => {
  const token = req.cookies.token;

  // if the cookie is not set, return an unauthorized error
  if (!token) {
    return res.status(401).send("Cookie not set").end();
  }

  var payload;
  try {
    // Parse the JWT string and store the result in `payload`.
    // Note that we are passing the key in this method as well. This method will throw an error
    // if the token is invalid (if it has expired according to the expiry time we set on sign in),
    // or if the signature does not match
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      return res.status(401).send("JWT is unauthorized").end();
    }

    // otherwise, return a bad request error
    return res.status(400).send("bad request").end();
  }
  next();
};

const refresh = async (req, res, next) => {
  // (BEGIN) The code uptil this point is the same as the first part of the `welcome` route
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send("Cookie not set").end();
  }

  var payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      return res.status(401).send("JWT is unauthorized").end();
    }
    return res.status(400).send("bad request").end();
  }
  // (END) The code uptil this point is the same as the first part of the `welcome` route

  // We ensure that a new token is not issued until enough time has elapsed
  // In this case, a new token will only be issued if the old token is within
  // 30 seconds of expiry. Otherwise, return a bad request status
  const nowUnixSeconds = Math.round(Number(new Date()) / 1000);
  if (payload.exp - nowUnixSeconds > 30) {
    // Now, create a new token for the current user, with a renewed expiration time
    const newToken = jwt.sign(
      { username: payload.username, role: payload.role },
      process.env.JWT_SECRET,
      {
        algorithm: "HS256",
        expiresIn: process.env.JWT_EXPIRES_IN * 1000,
      }
    );

    // Set the new token as the users `token` cookie
    res.cookie("token", newToken, {
      maxAge: process.env.JWT_EXPIRES_IN * 1000,
    });
  }

  // res.end()
  next();
};

function logout (req, res, next) {
  res.cookie("token", "", { maxAge: 0 });
  res.end();
  next();
};

module.exports = {
  welcome,
  refresh,
  router
};
