// const validate = require("mongoose-validator");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;
const Product  = require("./product");
// const emailValidator = validate({ validator: "isEmail" });

const userSchema = new Schema({
  name: {
    firstName: { type: String },
    lastName: { type: String },
  },
  gender: { type: ObjectId, ref: "Gender", required: true },
  dni: { type: String, required: true, unique: true },
  dateBirth: { type: Date, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    //validate: emailValidator,
  },
  username: { type: String, required: true, unique: true },
  password: { type: String, select: false },
  telephone: { type: String },
  personType: { type: ObjectId, ref: "PersonType", required: true },
  //products: { type: ObjectId, ref: 'Products'},
  products: [Product],
  cuilCuit: { type: String, required: true, unique: true },
  isActive: { type: Boolean },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
});

//const User = mongoose.model("User", userSchema);

//module.exports = User;
module.exports = userSchema;
