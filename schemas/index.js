const requireAll = require("require-all");
const toCamelCase = require("to-camel-case");

/* eslint-disable no-undef */

const schemas = {};

const genderTypeSchema = require("./genderType");
const currencyTypeSchema = require("./currencyType");
const movementTypeSchema = require("./movementType");
const personTypeSchema = require("./personType");
const productTypeSchema = require("./productType");
const productSchema = require("./product");
const userSchema = require("./user");

schemas["genderType"] = genderTypeSchema;
schemas["currencyType"] = currencyTypeSchema;
schemas["movementType"] = movementTypeSchema;
schemas["personType"] = personTypeSchema;
schemas["productType"] = productTypeSchema;
schemas["product"] = productSchema;
schemas["user"] = userSchema;

//console.log(schemas)

module.exports = {
  schemas,
};
