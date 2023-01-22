
const  validator = {};

const createUserValidator = require("./user");
const updateUserValidator = require("./user");
const updateProductValidator = require("./product");

validator["createUserValidator"] = createUserValidator;
validator["updateUserValidator"] = updateUserValidator;
validator["updateProductValidator"] = updateProductValidator;

module.exports = {
  validator,
};

