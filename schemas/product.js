const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const productSchema = new Schema({
    type: { type: ObjectId, ref: "ProductType", required: true },
    accountNumber: { type: String, required: true, unique: true },
    cbu: { type: String, required: true, unique: true },
    alias: { type: String, required: true, unique: true },      
    balance: { type: Number, required: true },
    overdraft: { type: Number, required: true },
    extractionLimit: { type: Number, required: true },
    currency: { type: ObjectId, ref: "CurrencyType", required: true },    
    movements: { type: ObjectId, ref: "Movement" },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
});

module.exports = productSchema;
