const express = require("express");
const { models } = require("../db");
const router = express.Router();
const mongoose = require("mongoose");
const validator = require("../validator");

/* GET users listing. */
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
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
      const newProduct = new models.Product({
        type: producttype._id,
        accountNumber: product.accountNumber,
        cbu: product.cbu,
        alias: product.alias,
        balanceAmount: product.balanceAmount,
        overdraftAmount: product.overdraftAmount,
        extractionLimit: product.extractionLimit,
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
        validateExistingAlias(product) &&
        productalias.id != productToUpdate.id
      ) {
        res.status(400).send("El alias ya se encuentra registrado");
      } else {

        productToUpdate.type = producttype;
        productToUpdate.accountNumber = product.accountNumber;
        productToUpdate.cbu = product.cbu;
        productToUpdate.alias = product.alias;
        productToUpdate.balanceAmount = product.balanceAmount;
        productToUpdate.overdraftAmount = product.overdraftAmount;
        productToUpdate.extractionLimit = product.extractionLimit;
        productToUpdate.currency = currencytype;
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

module.exports = router;
