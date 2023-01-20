const express = require("express");
const { models } = require("../db");
const router = express.Router();
const mongoose = require("mongoose");
const validator = require("../validator");
const bcrypt = require("bcrypt");

/* GET users listing. */
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", validator.createUserValidator, createUser);
router.put("/:id", validator.createUserValidator, updateUser);
router.delete("/:id", deleteUser);

async function getAllUsers(req, res, next) {
  try {
    const users = await models.User.find();
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
    const user = await models.User.findById(req.params.id);

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

  const user = req.body;

  try {
    const gender = await models.GenderType.findOne({
      description: user.gender,
    });
    if (!gender) {
      res.status(404).send("GenderType not found");
    }

    const personType = await models.PersonType.findOne({
      description: user.personType,
    });
    if (!personType) {
      res.status(404).send("personType not found");
    }

    if (await validateExistingEmail(user)) {
      res.status(400).send("El email ya se encuentra registrado");
    } else if (await validateExistingUsername(user)) {
      res.status(400).send("El usuario ya se encuentra registrado");
    } else if (await validateExistingDNI(user)) {
      res.status(400).send("El numero de DNI ya se encuentra registrado");
    } else if (await validateExistingCUILCUIT(user)) {
      res.status(400).send("El numero de CUIT/CUIL ya se encuentra registrado");
    } else {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);

      const newUser = new models.User({
        name: user.name,
        gender: gender._id,
        dni: user.dni,
        dateBirth: user.dateBirth,
        email: user.email,
        password: hashedPassword,
        username: user.username,
        telephone: user.telephone,
        personType: personType._id,
        createdAt: new Date(),
        updatedAt: new Date(),
        cuilCuit: user.cuilCuit,
      });

      newUser.save().then(res.send(newUser));
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
    const userToUpdate = await models.User.findById(req.params.id);
    if (!userToUpdate) {
      res.status(404).send("user not found");
    }

    const gender = await models.GenderType.findOne({
      description: user.gender,
    });
    if (!gender) {
      res.status(404).send("GenderType not found");
    }

    const personType = await models.PersonType.findOne({
      description: user.personType,
    });
    if (!personType) {
      res.status(404).send("personType not found");
    }

    try {
      const useremail = await models.User.findOne({ email: user.email });
      if (
        (await validateExistingEmail(user)) &&
        useremail.id != userToUpdate.id
      ) {
        res.status(400).send("El email ya se encuentra registrado");
      } else {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);

        userToUpdate.email = user.email;
        userToUpdate.password = hashedPassword;
        userToUpdate.name = user.name;
        userToUpdate.dni = user.dni;
        userToUpdate.dateBirth = user.dateBirth;
        userToUpdate.username = user.username;
        userToUpdate.telephone = user.telephone;
        userToUpdate.cuilCuit = user.cuilCuit;
        userToUpdate.gender = gender;
        userToUpdate.personType = personType;
        userToUpdate.updatedAt = new Date();

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
    const userToDelete = await models.User.findById(req.params.id);

    if (!userToDelete) {
      res.status(404).send("user not found");
    }

    await models.User.deleteOne({ _id: userToDelete._id });
    res.send(`User deleted :  ${req.params.id}`);
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

async function validateExistingUsername(user) {
  try {
    const userusername = await models.User.findOne({ username: user.username });
    if (userusername) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    next(err);
  }
}

async function validateExistingDNI(user) {
  try {
    const userdni = await models.User.findOne({ dni: user.dni });
    if (userdni) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    next(err);
  }
}

async function validateExistingCUILCUIT(user) {
  try {
    const usercuilCuit = await models.User.findOne({ cuilCuit: user.cuilCuit });
    if (usercuilCuit) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    next(err);
  }
}

module.exports = router;
