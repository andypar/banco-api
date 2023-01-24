const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const movementSchema = new Schema({
  accountFrom: { type: ObjectId, ref: "Product" },
  accountTo: { type: ObjectId, ref: "Product" },
  balance: { type: Number, required: true },
  totalBalance: { type: Number, required: true },
  type: { type: ObjectId, ref: "MovementType", required: true },
  descriptionMovement: { type: String, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
});

module.exports = movementSchema;
