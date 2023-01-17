const express = require("express");
const User = require("../schemas/user");
const router = express.Router();
const mongoose = require("mongoose");
const validator = require("../validator");
const bcrypt = require('bcrypt');


/* GET users listing. */
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", validator.createUserValidator, createUser);
router.put("/:id", validator.createUserValidator, updateUser);
router.delete("/:id", deleteUser);


async function getAllUsers(req, res, next) {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    next(err);
  }
}

async function getUserById(req, res, next) {
  console.log("getUserById with id: ", req.params.id);

  if (!req.params.id) {
    res.status(400).send("The param id is not defined");
  }

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).send("user not found");
    }
    res.send(user);
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  console.log("createUser: ", req.body.email);

  const user = req.body

  try {
    const useremail = await User.findOne({ email: req.body.email });
    if (useremail) {
      res.status(400).send("The email is already in use");
    } else {

	  const saltRounds = 10;
	  const hashedPassword = await bcrypt.hash(user.password, saltRounds)

      const newUser = new User({email: req.body.email, password: hashedPassword});
      newUser
		.save()
		.then(res.send(newUser));
    }
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  console.log("updateUser with id: ", req.params.id);

  if (!req.params.id) {
    res.status(400).send("The param id is not defined");
  }

  const user = req.body;

  try {
    const userToUpdate = await User.findById(req.params.id);

    if (!userToUpdate) {
      res.status(404).send("user not found");
    }

    try {
      const useremail = await User.findOne({ email: req.body.email });
      if (useremail && useremail.id != userToUpdate.id) {
        res.status(400).send("The email is already in use");
      } else {
		
		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(user.password, saltRounds)

        userToUpdate.email = user.email;
        userToUpdate.password = hashedPassword;
        await userToUpdate.save();
        res.send(userToUpdate);
      }
    } catch (err) {
      next(err);
    }
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  console.log("deleteUser with id: ", req.params.id);

  if (!req.params.id) {
    res.status(400).send("The param id is not defined");
  }

  try {
    const userToDelete = await User.findById(req.params.id);

    if (!userToDelete) {
      res.status(404).send("user not found");
    }
    await User.deleteOne({ _id: userToDelete._id });
    res.send(`User deleted :  ${req.params.id}`);
  } catch (err) {
    next(err);
  }
}

module.exports = router;
