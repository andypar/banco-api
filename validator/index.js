const validator = {};

const createUserValidator = require("./user");
const updateUserValidator = require("./user");
const updateProductValidator = require("./product");
const movementValidator = require("./movement");

validator["createUserValidator"] = createUserValidator;
validator["updateUserValidator"] = updateUserValidator;
validator["updateProductValidator"] = updateProductValidator;
validator["movementValidator"] = movementValidator;

module.exports = {
  validator,
};
