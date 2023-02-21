const express = require("express");
const { models } = require("../db");
const router = express.Router();
const mongoose = require("mongoose");
const validator = require("../validator");
const { ObjectId } = require("mongodb");
const logger = require("../logger");

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
router.get("/dates/:productid/:from/:to", getProductMovementsDates);
router.get("/datesamounts/:productid/:from/:to", getProductAmountsDates);
router.post("/deposit/:producttoid", movementValidator, createDepositMovement);
router.delete("/:id", deleteMovement);

async function getAllMovements(req, res, next) {
  console.log("getAllMovements");
  logger.info("getAllMovements");
  try {
    const products = await models.Movement.find();
    res.send(products);
  } catch (err) {
    logger.error("error getAllMovements: ", err);
    next(err);
  }
}

async function getMovementById(req, res, next) {
  console.log("getMovementById with id: ", req.params.id);
  logger.info("getMovementById with id: ", req.params.id);

  if (!req.params.id) {
    res.status(400).send("The param id is not defined");
    logger.warn("The param id is not defined");
    return;
  }

  try {
    const movement = await models.Movement.findById(req.params.id);

    if (!movement) {
      res.status(404).send("movement not found");
      logger.warn("movement not found");
      return;
    }
    res.send(movement);
  } catch (err) {
    next(err);
  }
}

async function createExtractionMovement(req, res, next) {
  console.log("createExtractionMovement: ", req.body.type);
  logger.info("createExtractionMovement: ", req.body.type);

  const movement = req.body;

  try {
    const product = await models.Product.findById(req.params.productfromid);
    if (!product) {
      res.status(404).send("Product not found");
      logger.warn("Product not found");
      return;
    }

    const movementtype = await models.MovementType.findOne({
      description: movement.type,
    });
    if (!movementtype) {
      res.status(404).send("MovementType not found");
      logger.warn("MovementType not found");
      return;
    }

    const producttype = await models.ProductType.findOne({
      _id: product.type,
    });
    if (!producttype) {
      res.status(404).send("ProductType not found");
      logger.warn("ProductType not found");
      return;
    }

    switch (producttype.description) {
      case "caja-ahorro":
        // CA:
        // 1) valido que mi saldo sea menor a lo que quier extraer
        // 2) valido que lo que quiera sacar no supere mi limite de extraccion diario
        if (product.balanceAmount < movement.balance) {
          res
            .status(400)
            .send(
              "El saldo de la Caja de Ahorro es inferior al monto a extraer!"
            );
          logger.warn(
            "El saldo de la Caja de Ahorro es inferior al monto a extraer!"
          );
          return;
        } else if (await accountExceedsDailyExtractionAmount(product.id)) {
          res.status(400).send("Se ha excedido el límite de extracción diario!");
          logger.warn("Se ha excedido el límite de extracción diario!");
          return;
        }
        break;

      case "cuenta-corriente":
        // CC:
        // 1) valido que mi saldo+sobregiro sea menor a lo que quier extraer
        // 2) valido que lo que quiera sacar no supere mi limite de extraccion diario
        if (
          product.balanceAmount + product.overdraftAmount <
          movement.balance
        ) {
          res
            .status(400)
            .send(
              "El saldo de la Cuenta Corriente es inferior al monto a extraer!"
            );
          logger.warn(
            "El saldo de la Cuenta Corriente es inferior al monto a extraer!"
          );
          return;
        } else if (await accountExceedsDailyExtractionAmount(product.id)) {
          res.status(400).send("Se ha excedido el límite de extracción diario!");
          logger.warn("Se ha excedido el límite de extracción diario!");
          return;
        }
        break;
    }
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const newMovement = new models.Movement({
        accountFrom: req.params.productfromid,
        balance: movement.balance,
        totalBalance: product.balanceAmount - movement.balance,
        type: movementtype,
        descriptionMovement: movement.descriptionMovement,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await newMovement.save();

      product.balanceAmount = product.balanceAmount - movement.balance;
      product.movements.push(newMovement);
      await product.save();
      session.commitTransaction();
      res.send(newMovement);
    } catch (err) {
      session.abortTransaction();
      logger.error("error transaction movement: ", err);
      throw err;
    } finally {
      session.endSession();
    }
  } catch (err) {
    logger.error("error createExtractionMovement: ", err);
    next(err);
  }
}

async function createDepositMovement(req, res, next) {
  console.log("createDepositMovement: ", req.body.type);
  logger.info("createDepositMovement: ", req.body.type);

  const movement = req.body;

  try {
    const product = await models.Product.findById(req.params.producttoid);
    if (!product) {
      res.status(404).send("Product not found");
      logger.warn("Product not found");
      return;
    }

    const movementtype = await models.MovementType.findOne({
      description: movement.type,
    });
    if (!movementtype) {
      res.status(404).send("MovementType not found");
      logger.warn("MovementType not found");
      return;
    }

    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const newMovement = new models.Movement({
        accountFrom: req.params.producttoid,
        balance: movement.balance,
        totalBalance: product.balanceAmount + Number(movement.balance),
        type: movementtype,
        descriptionMovement: movement.descriptionMovement,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await newMovement.save();

      product.balanceAmount = product.balanceAmount + Number(movement.balance);
      product.movements.push(newMovement);
      await product.save();
      session.commitTransaction();
      res.send(newMovement);
    } catch (err) {
      session.abortTransaction();
      logger.error("error: createDepositMovement: ", err);
      throw err;
    } finally {
      session.endSession();
    }
  } catch (err) {
    logger.error("error createDepositMovement: ", err);
    next(err);
  }
}

async function deleteMovement(req, res, next) {
  console.log("deleteMovement with id: ", req.params.id);
  logger.info("deleteMovement with id: ", req.params.id);

  if (!req.params.id) {
    res.status(400).send("The param id is not defined");
    logger.warn("The param id is not defined");
    return;
  }

  try {
    const movementToDelete = await models.Movement.findById(req.params.id);
    if (!movementToDelete) {
      res.status(404).send("movement not found");
      logger.warn("movement not found");
      return;
    }

    const movementtype = await models.MovementType.findOne({
      _id: movementToDelete.type,
    });
    if (!movementtype) {
      res.status(404).send("MovementType not found");
      logger.warn("MovementType not found");
      return;
    }

    const product = await models.Product.findOne({
      movements: req.params.id,
    });
    if (!product) {
      res.status(404).send("Product not found");
      logger.warn("Product not found");
      return;
    }

    if (movementtype.description === "extracción") {
      product.balanceAmount =
        product.balanceAmount + Number(movementToDelete.balance);
      product.save();
    }
    if (movementtype.description === "depósito") {
      product.balanceAmount = product.balanceAmount - movementToDelete.balance;
      product.save();
    }

    await models.Movement.deleteOne({ _id: movementToDelete._id });
    res.send(`Movement deleted :  ${req.params.id}`);
  } catch (err) {
    logger.error("logger deleteMovement: ", err);
    next(err);
  }
}

//const filterByExpiration = arr => arr.filter(({ createdAt }) => new Date(createdAt) >= today);
//console.log(filterByExpiration(movements))

async function getProductMovementsToday(req, res, next) {
  console.log("getProductMovementsToday with id: ", req.params.productid);
  logger.info("getProductMovementsToday with id: ", req.params.productid);

  try {
    const today = new Date(new Date().setHours(-3, 0, 0, 0));

    const product = await models.Product.findById(
      req.params.productid
    ).populate("movements");
    if (!product) {
      res.status(404).send("Product not found");
      logger.warn("Product not found");
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
    logger.error("error getProductMovementsToday: ", err);
    next(err);
  }
}

async function getProductAmountsToday(req, res, next) {
  console.log("getProductAmountsToday with id: ", req.params.productid);
  logger.info("getProductAmountsToday with id: ", req.params.productid);

  try {
    const product = await models.Product.findById(
      req.params.productid
    ).populate("movements");
    if (!product) {
      res.status(404).send("Product not found");
      logger.warn("Product not found");
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
    logger.error("error getProductAmountsToday: ", err);
    next(err);
  }
}

async function getTodayProductExtractionAmount(req, res, next) {
  console.log(
    "getTodayProductExtractionAmount with id: ",
    req.params.productid
  );
  logger.info(
    "getTodayProductExtractionAmount with id: ",
    req.params.productid
  );

  try {
    const product = await models.Product.findById(
      req.params.productid
    ).populate("movements");
    if (!product) {
      res.status(404).send("Product not found");
      logger.warn("Product not found");
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
    logger.error("error getTodayProductExtractionAmount: ", err);
    next(err);
  }
}

async function accountExceedsDailyExtractionAmount(productid) {
  console.log("accountExceedsDailyExtractionAmount with id: ", productid);
  logger.info("accountExceedsDailyExtractionAmount with id: ", productid);
  try {
    const product = await models.Product.findById(productid).populate(
      "movements"
    );
    if (!product) {
      res.status(404).send("Product not found");
      logger.warn("Product not found");
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

    if (!movements || movements.length === 0) {
      return false;
    }

    if (movements[0].sumamonto > product.extractionLimit) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    logger.error("error accountExceedsDailyExtractionAmount: ", err);
    next(err);
  }
}

async function getProductMovementsDates(req, res, next) {
  console.log("getProductMovementsDates with id: ", req.params.productid);
  logger.info("getProductMovementsDates with id: ", req.params.productid);

  try {
    const startdate = new Date(req.params.from);
    const enddate = new Date(req.params.to);

    const product = await models.Product.findById(
      req.params.productid
    ).populate("movements");
    if (!product) {
      res.status(404).send("Product not found");
      logger.warn("Product not found");
      return;
    }

    const movements = await models.Movement.find({
      createdAt: { $gte: startdate, $lte: enddate },
      accountFrom: product._id,
    })
      .populate({
        path: "type",
        model: "MovementType",
      })
      .sort("-createdAt")
      .select("createdAt balance descriptionMovement totalBalance");
    res.send(movements);
  } catch (err) {
    logger.error("error getProductMovementsDates: ", err);
    next(err);
  }
}

async function getProductAmountsDates(req, res, next) {
  console.log("getProductAmountsDates with id: ", req.params.productid);
  logger.info("getProductAmountsDates with id: ", req.params.productid);
  try {
    const product = await models.Product.findById(
      req.params.productid
    ).populate("movements");
    if (!product) {
      res.status(404).send("Product not found");
      logger.warn("Product not found");
      return;
    }

    const startdate = new Date(req.params.from);
    const enddate = new Date(req.params.to);

    const movements = await models.Movement.aggregate([
      {
        $match: {
          $and: [
            { createdAt: { $gte: startdate, $lte: enddate } },
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
    logger.error("error getProductAmountsDates: ", err);
    next(err);
  }
}

module.exports = router;
