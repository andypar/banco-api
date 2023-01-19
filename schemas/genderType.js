const mongoose = require("mongoose");

const { Schema } = mongoose;

const genderTypeSchema = new Schema({
  description: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
  },
});

module.exports = genderTypeSchema;
