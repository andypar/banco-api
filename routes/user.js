const express = require("express");
const { models } = require("../db");
const router = express.Router();
const mongoose = require("mongoose");
const validator = require("../validator");
const bcrypt = require("bcrypt");

/* GET users listing. */
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUserValidator, createUser);
router.put("/:id", updateUserValidator, updateUser);
router.delete("/:id", deleteUser);
router.put("/inactivate/:id", inactivateUser);
router.put("/associate/:userid/:productid", associateProductToUser);
router.put("/desassociate/:userid/:productid", desassociateProductToUser);


async function getAllUsers(req, res, next) {
  try {
    const users = await models.User.find({ isActive: true}).populate('products').populate('gender').populate('personType').populate('role',{match:{"description":"user"}});
    res.send(users);
  } catch (err) {
    next(err);
  }
}

async function getUserById(req, res, next) {
  console.log("getUserById with id: ", req.params.id);

  if (!req.params.id) {
    res.status(400).send("The param id is not defined");
    return
  }

  try {
    const user = await models.User.findById(req.params.id).populate('products').populate('gender').populate('personType').populate('role');

    if (!user) {
      res.status(404).send("user not found");
      return
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
      return
    }

    const personType = await models.PersonType.findOne({
      description: user.personType,
    });
    if (!personType) {
      res.status(404).send("personType not found");
      return
    }

    if (await validateExistingEmail(user)) {
      res.status(400).send("El email ya se encuentra registrado");
      return
    } else if (await validateExistingUsername(user)) {
      res.status(400).send("El usuario ya se encuentra registrado");
      return
    } else if (await validateExistingDNI(user)) {
      res.status(400).send("El numero de DNI ya se encuentra registrado");
      return
    } else if (await validateExistingCUILCUIT(user)) {
      res.status(400).send("El numero de CUIT/CUIL ya se encuentra registrado");
      return
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
        cuilCuit: user.cuilCuit,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
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
    return
  }

  const user = req.body;

  try {
    const userToUpdate = await models.User.findById(req.params.id);
    if (!userToUpdate) {
      res.status(404).send("user not found");
      return
    }

    const gender = await models.GenderType.findOne({
      description: user.gender,
    });
    if (!gender) {
      res.status(404).send("GenderType not found");
      return
    }

    const personType = await models.PersonType.findOne({
      description: user.personType,
    });
    if (!personType) {
      res.status(404).send("personType not found");
      return
    }

    try {
      const useremail = await models.User.findOne({ email: user.email });
      if (
        (await validateExistingEmail(user)) &&
        useremail.id != userToUpdate.id
      ) {
        res.status(400).send("El email ya se encuentra registrado");
        return
      } else {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);

        userToUpdate.name = user.name;
        userToUpdate.dateBirth = user.dateBirth;
        userToUpdate.email = user.email;
        userToUpdate.password = hashedPassword;
        userToUpdate.telephone = user.telephone;
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
    return
  }

  try {
    const userToDelete = await models.User.findById(req.params.id);

    if (!userToDelete) {
      res.status(404).send("user not found");
      return
    }

    await models.User.deleteOne({ _id: userToDelete._id });
    res.send(`User deleted :  ${req.params.id}`);
  } catch (err) {
    next(err);
  }
}

async function inactivateUser(req, res, next) {
  console.log("inactivateUser with id: ", req.params.id);

  if (!req.params.id) {
    res.status(400).send("The param id is not defined");
    return
  }

  try {
    const userToInactivate = await models.User.findById(req.params.id);
    if (!userToInactivate) {
      res.status(404).send("user not found");
      return
      return;
    }
    if (!userToInactivate.isActive){
      res.status(404).send("user is already inactive");
      return
    }

    userToInactivate.dni = userToInactivate.dni + "-INACTIVE";
    userToInactivate.cuilCuit = userToInactivate.cuilCuit + "-INACTIVE";
    userToInactivate.username = userToInactivate.username + "-INACTIVE";
    userToInactivate.email = userToInactivate.email + "-INACTIVE";
    userToInactivate.isActive = false;
    userToInactivate.updatedAt = new Date();

    await userToInactivate.save();
    res.send(userToInactivate);
  } catch (err) {
    next(err);
  }
}

async function associateProductToUser(req, res, next) {
  console.log("updateUser with id: ", req.params.userid);


  if (!req.params.productid) {
    res.status(400).send("The param productid is not defined");
    return
  }

  if (!req.params.userid) {
    res.status(400).send("The param userid is not defined");
    return
  }

  try {
    const product = await models.Product.findById(req.params.productid);
    if (!product) {
      res.status(404).send("product not found");
      return
    }


    const user = await models.User.findById(req.params.userid);
    if (!user) {
      res.status(404).send("user not found");
      return
    }

    user.products.push(product);

    await user.save();
    res.send(user);

  } catch (err) {
    next(err);
  }
}


async function desassociateProductToUser(req, res, next) {
  console.log("updateUser with id: ", req.params.userid);


  if (!req.params.productid) {
    res.status(400).send("The param productid is not defined");
    return
  }

  if (!req.params.userid) {
    res.status(400).send("The param userid is not defined");
    return
  }

  try {
    const product = await models.Product.findById(req.params.productid);
    if (!product) {
      res.status(404).send("product not found");
      return
    }


    const user = await models.User.findById(req.params.userid);
    if (!user) {
      res.status(404).send("user not found");
      return
    }

    user.products.pull(product);

    await user.save();
    res.send(user);

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
