const express = require("express");
const { models } = require("../db");
const router = express.Router();
const mongoose = require("mongoose");
const validator = require("../validator"); 
const { ObjectId } = require("mongodb");

/* GET movements listing. */
router.get("/", getAllMovements);
router.get("/today", getMovementsToday);
router.get("/amountstoday", getAmountsToday);
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
      descriptionMovement: movement.descriptionMovement,
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
  
      const movementtype = await models.MovementType.findOne({
        description: movement.type,
        });
        if (!movementtype) {
          res.status(404).send("MovementType not found");
          return
        } 
    
      const newMovement = new models.Movement({
        accountFrom: req.params.producttoid,
        balance: movement.balance,
        totalBalance: product.balanceAmount+Number(movement.balance),
        type: movementtype,
        descriptionMovement: movement.descriptionMovement,
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
      return
    }

    const product = await models.Product.findOne({
      movements: req.params.id,
    });
    if (!product) {
      res.status(404).send("Product not found");
      return
    }

    if(movementtype.description==="extraccion"){
      product.balanceAmount = product.balanceAmount+Number(movementToDelete.balance);
      console.log(product.balanceAmount)
      product.save();
    } 
    if(movementtype.description==="deposito"){
      product.balanceAmount = product.balanceAmount-movementToDelete.balance;
      console.log(product.balanceAmount)
      product.save();
    } 

    await models.Movement.deleteOne({ _id: movementToDelete._id });
    res.send(`Movement deleted :  ${req.params.id}`);
    
  } catch (err) {
    next(err);
  }
}

//const filterByExpiration = arr => arr.filter(({ createdAt }) => new Date(createdAt) >= today);
//console.log(filterByExpiration(products))

async function getMovementsToday(req, res, next) {
  try {
    const today = new Date(new Date().setHours(-3,0,0,0));
    const products = await models.Movement
    .find({createdAt: {$gte: today}, type:ObjectId("000000000000000000000002")})
    //.populate({ path:"type", model: 'MovementType', match:{description: {$eq: "deposito"}}})
    .populate({ path:"type", model: 'MovementType'})
    .select("createdAt balance descriptionMovement");
    res.send(products);
  } catch (err) {
    next(err);
  }
}


async function getAmountsToday(req, res, next) {
  
  try {
    const today = new Date(new Date().setHours(-3,0,0,0));
    //console.log(today)
    //console.log(new Date())

    const products = await models.Movement.aggregate([

      { $match: {
        $and:[ 
          {createdAt: {$gte: today}}, 
          // {description: {$in: ["ingreso plata"]}},
          {type: {$in: [ObjectId("000000000000000000000002")]}}
        ] } },
      {
        $group: {
          _id: "$type",
          count: {
            $sum: "$balance"
          }
        }
      }
    ])

    res.send(products);
  } catch (err) {
    next(err);
  }
}

module.exports = router;
