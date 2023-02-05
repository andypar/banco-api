const { models } = require("../db");
const mongoose = require("mongoose");
//const Schema = mongoose.Schema;
//const { ObjectId } = mongoose.Schema.Types.ObjectId;

async function up() {
  await models.GenderType.create([
    {
      _id: new mongoose.Types.ObjectId("000000000000000000000000"),
      description: "femenino",
    },
    {
      _id: new mongoose.Types.ObjectId("000000000000000000000001"),
      description: "masculino",
    },
    {
      _id: new mongoose.Types.ObjectId("000000000000000000000002"),
      description: "indeterminado",
    },
  ]);

  await models.CurrencyType.create([
    {
      _id: new mongoose.Types.ObjectId("000000000000000000000000"),
      description: "ars",
    },
    {
      _id: new mongoose.Types.ObjectId("000000000000000000000001"),
      description: "usd",
    },
  ]);

  await models.MovementType.create([
    {
      _id: new mongoose.Types.ObjectId("000000000000000000000000"),
      description: "depósito",
    },
    {
      _id: new mongoose.Types.ObjectId("000000000000000000000001"),
      description: "extración",
    },
    // {
    //   _id: new mongoose.Types.ObjectId('000000000000000000000002'),
    //   description: "transferencia",
    // },
  ]);

  await models.ProductType.create([
    {
      _id: new mongoose.Types.ObjectId("000000000000000000000000"),
      description: "caja-ahorro",
    },
    {
      _id: new mongoose.Types.ObjectId("000000000000000000000001"),
      description: "cuenta-corriente",
    },
  ]);

  await models.PersonType.create([
    {
      _id: new mongoose.Types.ObjectId("000000000000000000000000"),
      description: "física",
    },
    {
      _id: new mongoose.Types.ObjectId("000000000000000000000001"),
      description: "jurídica",
    },
  ]);

  await models.RoleType.create([
    {
      _id: new mongoose.Types.ObjectId("000000000000000000000000"),
      description: "admin",
    },
    {
      _id: new mongoose.Types.ObjectId("000000000000000000000001"),
      description: "employee",
    },
    {
      _id: new mongoose.Types.ObjectId("000000000000000000000002"),
      description: "user",
    },
  ]);
}

async function down() {
  await models.GenderType.deleteMany({
    _id: [
      "000000000000000000000000",
      "000000000000000000000001",
      "000000000000000000000002",
    ],
  });

  await models.CurrencyType.deleteMany({
    _id: ["000000000000000000000000", "000000000000000000000001"],
  });

  await models.MovementType.deleteMany({
    _id: ["000000000000000000000000", "000000000000000000000001"], //'000000000000000000000002'
  });

  await models.ProductType.deleteMany({
    _id: ["000000000000000000000000", "000000000000000000000001"],
  });

  await models.PersonType.deleteMany({
    _id: ["000000000000000000000000", "000000000000000000000001"],
  });

  await models.RoleType.deleteMany({
    _id: [
      "000000000000000000000000",
      "000000000000000000000001",
      "000000000000000000000002",
    ],
  });
}

module.exports = { up, down };
