const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

// db
mongoose.connect(process.env.MONGO_URL).then(() => console.log("DB Connected"));

mongoose.connection.on("error", (err) => {
  console.log(`Error de conexion: ${err.message}`);
});

const { schemas } = require("./schemas");

const models = {};

models.GenderType = mongoose.model("GenderType", schemas.genderType);
models.PersonType = mongoose.model("PersonType", schemas.personType);
models.CurrencyType = mongoose.model("CurrencyType", schemas.currencyType);
models.ProductType = mongoose.model("ProductType", schemas.productType);
models.MovementType = mongoose.model("MovementType", schemas.movementType);
models.User = mongoose.model("User", schemas.user);
models.Product = mongoose.model("Product", schemas.product);

const db = {};
db.models = models;

module.exports = db;
