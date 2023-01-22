const express = require("express");
const { models } = require("../db");
const router = express.Router();
const mongoose = require("mongoose");
const validator = require("../validator");

/* GET users listing. */
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProductValidator, updateProduct);
router.delete("/:id", deleteProduct);

async function getAllProducts(req, res, next) {
  try {
    const products = await models.Product.find();
    res.send(products);
  } catch (err) {
    next(err);
  }
}

async function getProductById(req, res, next) {
  console.log("getProductById with id: ", req.params.id);

  if (!req.params.id) {
    res.status(400).send("The param id is not defined");
  }

  try {
    const product = await models.Product.findById(req.params.id);

    if (!product) {
      res.status(404).send("product not found");
    }
    res.send(product);
  } catch (err) {
    next(err);
  }
}

async function createProduct(req, res, next) {
  console.log("createProduct: ", req.body.accountNumber);

  const product = req.body;

  try {
    const producttype = await models.ProductType.findOne({
      description: product.type,
    });
    if (!producttype) {
      res.status(404).send("ProductType not found");
    }

    const currencytype = await models.CurrencyType.findOne({
      description: product.currency,
    });
    if (!currencytype) {
      res.status(404).send("CurrencyType not found");
    }

    
    if (await validateExistingAlias(product)) {
      res.status(400).send("El alias ya se encuentra registrado");
    } else {
      const cbuNumber = generate(22);
      const newProduct = new models.Product({
        type: producttype._id,
        accountNumber: cbuNumber.substring(3,7)+'/'+cbuNumber.substring(7,19)+'/'+cbuNumber.substring(19,21),
        cbu: cbuNumber,
        alias: makealias(5)+'.'+makealias(5)+'.'+makealias(5),
        balanceAmount: generate(5),
        overdraftAmount: generate(4),
        extractionLimit: generate(4),
        currency: currencytype._id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      newProduct.save().then(res.send(newProduct));
    }
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  console.log("updateProduct with id: ", req.params.id);

  if (!req.params.id) {
    res.status(400).send("The param id is not defined");
  }

  const product = req.body;

  try {
    const productToUpdate = await models.Product.findById(req.params.id);
    if (!productToUpdate) {
      res.status(404).send("product not found");
    }

    const producttype = await models.ProductType.findOne({
      description: product.type,
    });
    if (!producttype) {
      res.status(404).send("ProductType not found");
    }

    const currencytype = await models.CurrencyType.findOne({
      description: product.currency,
    });
    if (!currencytype) {
      res.status(404).send("CurrencyType not found");
    }

    try {
      const productalias = await models.Product.findOne({ alias: product.alias });
      if (
        await validateExistingAlias(product) &&
        productalias.id != productToUpdate.id
      ) {
        res.status(400).send("El alias ya se encuentra registrado");
      } else {

        //productToUpdate.type = producttype;
        //productToUpdate.accountNumber = product.accountNumber;
        //productToUpdate.cbu = product.cbu;
        productToUpdate.alias = product.alias;
        //productToUpdate.balanceAmount = product.balanceAmount;
        //productToUpdate.overdraftAmount = product.overdraftAmount;
        //productToUpdate.extractionLimit = product.extractionLimit;
        //productToUpdate.currency = currencytype;
        productToUpdate.updatedAt = new Date();

        await productToUpdate.save();
        res.send(productToUpdate);
      }
    } catch (err) {
      next(err);
    }
  } catch (err) {
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  console.log("deleteProduct with id: ", req.params.id);

  if (!req.params.id) {
    res.status(400).send("The param id is not defined");
  }

  try {
    const productToDelete = await models.Product.findById(req.params.id);

    if (!productToDelete) {
      res.status(404).send("product not found");
    }

    await models.Product.deleteOne({ _id: productToDelete._id });
    res.send(`Product deleted :  ${req.params.id}`);
  } catch (err) {
    next(err);
  }
}


async function validateExistingAlias(product) {
  try {
    const productalias = await models.Product.findOne({ alias: product.alias });
    if (productalias) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    next(err);
  }
}

function generate(n) {
  var add = 1,
    max = 12 - add;

  if (n > max) {
    return generate(max) + generate(n - max);
  }

  max = Math.pow(10, n + add);
  var min = max / 10; // Math.pow(10, n) basically 
  var number = Math.floor(Math.random() * (max - min + 1)) + min;

  return ("" + number).substring(add);
}


function makealias(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


module.exports = router;
