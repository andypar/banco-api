const express = require("express");
const { models } = require("../db");
const router = express.Router();
const mongoose = require("mongoose");
const validator = require("../validator");
const logger = require("../logger");

/* GET products listing. */
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProductValidator, updateProduct);
router.delete("/:id", deleteProduct);
router.get("/available/:userid", getUserAvailableProducts);

async function getAllProducts(req, res, next) {
  console.log("getAllProducts");
  logger.info("getAllProducts");
  try {
    const products = await models.Product.find()
      .populate("movements")
      .populate("currency")
      .populate("type");
    res.send(products);
  } catch (err) {
    logger.error("error getAllProducts: ", err);
    next(err);
  }
}

async function getProductById(req, res, next) {
  console.log("getProductById with id: ", req.params.id);
  logger.info("getProductById with id: ", req.params.id);

  if (!req.params.id) {
    res.status(400).send("The param id is not defined");
    logger.warn("The param id is not defined");
    return;
  }

  try {
    const product = await models.Product.findById(req.params.id)
      .populate("movements")
      .populate("currency")
      .populate("type");

    if (!product) {
      res.status(404).send("product not found");
      logger.warn("product not found");
      return;
    }
    res.send(product);
  } catch (err) {
    logger.error("error getProductById: ", err);
    next(err);
  }
}

async function getUserAvailableProducts(req, res, next) {
  console.log("getUserAvailableProducts with id: ", req.params.userid);
  logger.warn("getUserAvailableProducts with id: ", req.params.userid);

  if (!req.params.userid) {
    res.status(400).send("The param user is not defined");
    logger.warn("The param user is not defined");
    return;
  }

  try {
    const user = await models.User.findById(req.params.userid);
    if (!user) {
      res.status(404).send("user not found");
      logger.warn("user not found");
      return;
    }

    userproducts = user.products;

    const product = await models.Product.find({ _id: { $in: userproducts } })
      .select("x")
      .populate("currency")
      .populate("type");

    if (!product) {
      res.status(404).send("product not found");
      logger.warn("product not found");
      return;
    }

    currentproducts = [];
    product.forEach((element) => {
      currentproducts.push({
        type: element.type.id,
        type: element.type.description,
        currency: element.currency.description,
        currency: element.currency.description,
      });
    });

    // ret = []
    // ret.push({'type':product[0].type.description, 'currency': product[0].currency.description})
    // ret.push({'type':product[1].type.description, 'currency': product[1].currency.description})

    const types = await models.ProductType.find();
    const currencies = await models.CurrencyType.find();

    availableproducts = [];
    types.forEach((element) => {
      currencies.forEach((element2) => {
        availableproducts.push({
          type_id: element._id,
          type: element.description,
          currency_id: element2._id,
          currency: element2.description,
        });
      });
    });

    // const types = await models.ProductType.find()
    // ret2.push(types)
    // const currencies = await models.CurrencyType.find()
    // ret2.push(currencies

    res.send(getDifference(availableproducts, currentproducts));
  } catch (err) {
    logger.error("error getUserAvailableProducts: ", err);
    next(err);
  }
}

async function createProduct(req, res, next) {
  console.log("createProduct: ", req.body.type);
  logger.info("createProduct: ", req.body.type);

  const product = req.body;

  try {
    const producttype = await models.ProductType.findOne({
      description: product.type,
    });
    if (!producttype) {
      res.status(404).send("ProductType not found");
      logger.warn("ProductType not found");
      return;
    }

    const currencytype = await models.CurrencyType.findOne({
      description: product.currency,
    });
    if (!currencytype) {
      res.status(404).send("CurrencyType not found");
      logger.warn("CurrencyType not found");
      return;
    }

    if (await validateExistingAlias(product)) {
      res.status(400).send("El alias ya se encuentra registrado");
      logger.warn("El alias ya se encuentra registrado");
      return;
    } else {
      const cbuNumber = generate(22);
      const newProduct = new models.Product({
        type: producttype._id,
        accountNumber:
          cbuNumber.substring(3, 7) +
          "/" +
          cbuNumber.substring(7, 19) +
          "/" +
          cbuNumber.substring(19, 21),
        cbu: cbuNumber,
        alias: makealias(5) + "." + makealias(5) + "." + makealias(5),
        //balanceAmount: generate(5),
        balanceAmount: 0,
        overdraftAmount: generate(4),
        extractionLimit: generate(4),
        currency: currencytype._id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      newProduct.save().then(res.send(newProduct));
    }
  } catch (err) {
    logger.error("error createProduct: ", err);
    next(err);
  }
}

async function updateProduct(req, res, next) {
  console.log("updateProduct with id: ", req.params.id);
  logger.info("updateProduct with id: ", req.params.id);

  if (!req.params.id) {
    res.status(400).send("The param id is not defined");
    logger.warn("The param id is not defined");
    return;
  }

  const product = req.body;

  try {
    const productToUpdate = await models.Product.findById(req.params.id);
    if (!productToUpdate) {
      res.status(404).send("product not found");
      logger.warn("product not found");
      return;
    }

    const producttype = await models.ProductType.findOne({
      description: product.type,
    });
    if (!producttype) {
      res.status(404).send("ProductType not found");
      logger.warn("ProductType not found");
      return;
    }

    const currencytype = await models.CurrencyType.findOne({
      description: product.currency,
    });
    if (!currencytype) {
      res.status(404).send("CurrencyType not found");
      logger.warn("CurrencyType not found");
      return;
    }

    try {
      const productalias = await models.Product.findOne({
        alias: product.alias,
      });
      if (
        (await validateExistingAlias(product)) &&
        productalias.id != productToUpdate.id
      ) {
        res.status(400).send("El alias ya se encuentra registrado");
        logger.warn("El alias ya se encuentra registrado");
        return;
      } else {
        productToUpdate.alias = product.alias;
        productToUpdate.updatedAt = new Date();

        await productToUpdate.save();
        res.send(productToUpdate);
      }
    } catch (err) {
      logger.error("errorupdateProduct1: ", err);
      next(err);
    }
  } catch (err) {
    logger.error("errorupdateProduct2: ", err);
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  console.log("deleteProduct with id: ", req.params.id);
  logger.info("deleteProduct with id: ", req.params.id);

  if (!req.params.id) {
    res.status(400).send("The param id is not defined");
    logger.warn("The param id is not defined");
    return;
  }

  try {
    const productToDelete = await models.Product.findById(req.params.id);

    if (!productToDelete) {
      res.status(404).send("product not found");
      logger.warn("product not found");
      return;
    }

    await models.Product.deleteOne({ _id: productToDelete._id });
    res.send(`Product deleted :  ${req.params.id}`);
  } catch (err) {
    logger.error("error deleteProduct: ", err);
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
    logger.error("error validateExistingAlias: ", err);
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
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function getDifference(array1, array2) {
  return array1.filter((object1) => {
    return !array2.some((object2) => {
      return (
        object1.type === object2.type && object1.currency === object2.currency
      );
    });
  });
}

module.exports = router;
