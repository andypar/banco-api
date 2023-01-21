
const schemas = {};

const genderTypeSchema = require("./genderType");
const currencyTypeSchema = require("./currencyType");
const movementTypeSchema = require("./movementType");
const personTypeSchema = require("./personType");
const productTypeSchema = require("./productType");
const productSchema = require("./product");
const movementSchema = require("./movement");
const userSchema = require("./user");

schemas["genderType"] = genderTypeSchema;
schemas["currencyType"] = currencyTypeSchema;
schemas["movementType"] = movementTypeSchema;
schemas["personType"] = personTypeSchema;
schemas["productType"] = productTypeSchema;
schemas["product"] = productSchema;
schemas["movement"] = movementSchema;
schemas["user"] = userSchema;

module.exports = {
  schemas,
};
