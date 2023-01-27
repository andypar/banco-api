// const validate = require("mongoose-validator");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;
const Product  = require("./product");
const bcrypt = require("bcrypt");
// const emailValidator = validate({ validator: "isEmail" });

const userSchema = new Schema({
  name: {
    firstName: { type: String },
    lastName: { type: String },
  },
  gender: { type: ObjectId, ref: "GenderType", required: true },
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
  //products: [Product],
  products: [{ type: ObjectId, ref: 'Product'}],
  cuilCuit: { type: String, required: true, unique: true },
  isActive: { type: Boolean },
  role: { type: ObjectId, ref: "RoleType", required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
});

//const User = mongoose.model("User", userSchema);

userSchema.method('checkPassword', async function checkPassword(potentialPassword) {
  if (!potentialPassword) {
    return Promise.reject(new Error('Password is required'))
  }

  const isMatch = await bcrypt.compare(potentialPassword, this.password)

  return { isOk: isMatch }
})

module.exports = userSchema;
