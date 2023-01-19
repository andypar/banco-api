const mongoose = require("mongoose");

const { Schema } = mongoose;

const productTypeSchema = new Schema({
  description: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
  },
});

module.exports = productTypeSchema;
