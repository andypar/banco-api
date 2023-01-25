const express = require("express");
const { models } = require("../db");
const router = express.Router();
const mongoose = require("mongoose");
const validator = require("../validator");
const { ObjectId } = require("mongodb");

/* GET movements listing. */
router.get("/", getAllMovements);
router.get("/:id", getMovementById);
router.get("/today/:productid", getProductMovementsToday);
router.get("/todayamounts/:productid", getProductAmountsToday);
router.get("/dailyextraction/:productid", getTodayProductExtractionAmount);
router.post(
  "/extraction/:productfromid",
  movementValidator,
  createExtractionMovement
);
router.post("/deposit/:producttoid", movementValidator, createDepositMovement);
router.delete("/:id", deleteMovement);

async function getAllMovements(req, res, next) {
  try {
    const products = await models.Movement.find();
    res.send(products);
  } catch (err) {
    next(err);
  }
}

async function getMovementById(req, res, next) {
  console.log("getMovementById with id: ", req.params.id);

  if (!req.params.id) {
    res.status(400).send("The param id is not defined");
    return;
  }

  try {
    const movement = await models.Movement.findById(req.params.id);

    if (!movement) {
      res.status(404).send("movement not found");
      return;
    }
    res.send(movement);
  } catch (err) {
    next(err);
  }
}

async function createExtractionMovement(req, res, next) {
  console.log("createExtractionMovement: ", req.body.type);

  const movement = req.body;

  try {
    const product = await models.Product.findById(req.params.productfromid);
    if (!product) {
      res.status(404).send("Product not found");
      return;
    }

    const movementtype = await models.MovementType.findOne({
      description: movement.type,
    });
    if (!movementtype) {
      res.status(404).send("MovementType not found");
      return;
    }

    // CA:
    // 1) valido que mi saldo sea menor a lo que quier extraer
    // 2) valido que lo que quiera sacar no supere mi limite de extraccion diario
    if (product.balanceAmount < movement.balance) {
      res
        .status(400)
        .send("Balance of the account is lower than the amount to extract");
      return;
    } else if (await accountExceedsDailyExtractionAmount(product.id)) {
      res.status(400).send("Extraction limit exceeded");
      return;
    }

    const newMovement = new models.Movement({
      accountFrom: req.params.productfromid,
      balance: movement.balance,
      totalBalance: product.balanceAmount - movement.balance,
      type: movementtype,
      descriptionMovement: movement.descriptionMovement,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    newMovement.save();

    product.balanceAmount = product.balanceAmount - movement.balance;
    product.movements.push(newMovement);
    product.save();
    res.send(newMovement);
  } catch (err) {
    next(err);
  }
}

async function createDepositMovement(req, res, next) {
  console.log("createDepositMovement: ", req.body.type);

  const movement = req.body;

  try {
    const product = await models.Product.findById(req.params.producttoid);
    if (!product) {
      res.status(404).send("Product not found");
      return;
    }

    const movementtype = await models.MovementType.findOne({
      description: movement.type,
    });
    if (!movementtype) {
      res.status(404).send("MovementType not found");
      return;
    }

    const newMovement = new models.Movement({
      accountFrom: req.params.producttoid,
      balance: movement.balance,
      totalBalance: product.balanceAmount + Number(movement.balance),
      type: movementtype,
      descriptionMovement: movement.descriptionMovement,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    newMovement.save();

    product.balanceAmount = product.balanceAmount + Number(movement.balance);
    product.movements.push(newMovement);
    product.save();

    res.send(newMovement);
  } catch (err) {
    next(err);
  }
}

async function deleteMovement(req, res, next) {
  console.log("deleteMovement with id: ", req.params.id);

  if (!req.params.id) {
    res.status(400).send("The param id is not defined");
    return;
  }

  try {
    const movementToDelete = await models.Movement.findById(req.params.id);
    if (!movementToDelete) {
      res.status(404).send("movement not found");
      return;
    }

    const movementtype = await models.MovementType.findOne({
      _id: movementToDelete.type,
    });
    if (!movementtype) {
      res.status(404).send("MovementType not found");
      return;
    }

    const product = await models.Product.findOne({
      movements: req.params.id,
    });
    if (!product) {
      res.status(404).send("Product not found");
      return;
    }

    if (movementtype.description === "extraccion") {
      product.balanceAmount =
        product.balanceAmount + Number(movementToDelete.balance);
      product.save();
    }
    if (movementtype.description === "deposito") {
      product.balanceAmount = product.balanceAmount - movementToDelete.balance;
      product.save();
    }

    await models.Movement.deleteOne({ _id: movementToDelete._id });
    res.send(`Movement deleted :  ${req.params.id}`);
  } catch (err) {
    next(err);
  }
}

//const filterByExpiration = arr => arr.filter(({ createdAt }) => new Date(createdAt) >= today);
//console.log(filterByExpiration(movements))

async function getProductMovementsToday(req, res, next) {
  try {
    const today = new Date(new Date().setHours(-3, 0, 0, 0));

    const product = await models.Product.findById(
      req.params.productid
    ).populate("movements");
    if (!product) {
      res.status(404).send("Product not found");
      return;
    }

    const movements = await models.Movement.find({
      createdAt: { $gte: today },
      accountFrom: product._id,
    })
      .populate({ path: "type", model: "MovementType" })
      .select("createdAt balance descriptionMovement");
    res.send(movements);
  } catch (err) {
    next(err);
  }
}

async function getProductAmountsToday(req, res, next) {
  try {
    const product = await models.Product.findById(
      req.params.productid
    ).populate("movements");
    if (!product) {
      res.status(404).send("Product not found");
      return;
    }

    const today = new Date(new Date().setHours(-3, 0, 0, 0));
    //console.log(today)
    //console.log(new Date())

    const movements = await models.Movement.aggregate([
      {
        $match: {
          $and: [
            { createdAt: { $gte: today } },
            { accountFrom: { $eq: product._id } },
          ],
        },
      },
      {
        $group: {
          _id: "$type",
          count: {
            $sum: "$balance",
          },
        },
      },
    ]);

    res.send(movements);
  } catch (err) {
    next(err);
  }
}

async function getTodayProductExtractionAmount(req, res, next) {
  try {
    const product = await models.Product.findById(
      req.params.productid
    ).populate("movements");
    if (!product) {
      res.status(404).send("Product not found");
      return;
    }

    const today = new Date(new Date().setHours(-3, 0, 0, 0));
    const movements = await models.Movement.aggregate([
      {
        $match: {
          $and: [
            { createdAt: { $gte: today } },
            { type: { $in: [ObjectId("000000000000000000000001")] } }, //extraccion
            { accountFrom: { $eq: product._id } },
          ],
        },
      },
      {
        $group: {
          _id: "$accountFrom",
          sumamonto: {
            $sum: "$balance",
          },
        },
      },
    ]);

    res.send(movements);
  } catch (err) {
    next(err);
  }
}

async function accountExceedsDailyExtractionAmount(productid) {
  try {
    const product = await models.Product.findById(productid).populate(
      "movements"
    );
    if (!product) {
      res.status(404).send("Product not found");
      return;
    }

    const today = new Date(new Date().setHours(-3, 0, 0, 0));
    const movements = await models.Movement.aggregate([
      {
        $match: {
          $and: [
            { createdAt: { $gte: today } },
            { type: { $in: [ObjectId("000000000000000000000001")] } }, //extraccion
            { accountFrom: { $eq: product._id } },
          ],
        },
      },
      {
        $group: {
          _id: "$accountFrom",
          sumamonto: {
            $sum: "$balance",
          },
        },
      },
    ]);

    if (!movements || movements.length===0){
      return false;
    } 

    if (movements[0].sumamonto > product.extractionLimit) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err)
    next(err);
  }
}

module.exports = router;
