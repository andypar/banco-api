const express = require("express");
const { models } = require("../db");
const router = express.Router();
const mongoose = require("mongoose");
const validator = require("../validator");

/* GET movements listing. */
router.get("/", getAllMovements);
router.get("/:id", getMovementById);
router.post("/extraction/:productfromid", movementValidator, createExtractionMovement);
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
    if (product.totalBalance < movement.balance){
        res.status(400).send("Balance of the account is lower than the amount to extract");
        return;
    }

    const movementtype = await models.MovementType.findOne({
        description: movement.type,
      });
      if (!movementtype) {
        res.status(404).send("MovementType not found");
        return
      } 

    const newMovement = new models.Movement({
      accountFrom: req.params.productfromid,
      balance: movement.balance,
      totalBalance: product.balanceAmount-movement.balance,
      type: movementtype,
      description: movement.description,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    newMovement.save()

    product.balanceAmount=product.balanceAmount-movement.balance
    product.movements.push(newMovement);
    product.save()
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
      console.log(product)
    //   if (product.totalBalance < movement.balance){
    //       res.status(400).send("Balance of the account is lower than the amount to extract");
    //       return;
    //   }
  
      const movementtype = await models.MovementType.findOne({
          description: movement.type,
        });
        if (!movementtype) {
          res.status(404).send("MovementType not found");
          return
        } 
        console.log(movementtype)
    
      const newMovement = new models.Movement({
        accountFrom: req.params.producttoid,
        balance: movement.balance,
        totalBalance: product.balanceAmount+Number(movement.balance),
        type: movementtype,
        description: movement.description,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      newMovement.save()
  
      product.balanceAmount=product.balanceAmount+Number(movement.balance)
      product.movements.push(newMovement);
      product.save()

      res.send(newMovement);
  
    } catch (err) {
      next(err);
    }
  }
  

async function deleteMovement(req, res, next) {
  console.log("deleteProduct with id: ", req.params.id);

  if (!req.params.id) {
    res.status(400).send("The param id is not defined");
    return;
  }

  try {
    const productToDelete = await models.Movement.findById(req.params.id);

    if (!productToDelete) {
      res.status(404).send("movement not found");
      return;
    }

    await models.Movement.deleteOne({ _id: productToDelete._id });
    res.send(`Product deleted :  ${req.params.id}`);
  } catch (err) {
    next(err);
  }
}

module.exports = router;
