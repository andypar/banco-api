const { models } = require("../db");
const mongoose = require("mongoose");
//const Schema = mongoose.Schema;
//const { ObjectId } = mongoose.Schema.Types.ObjectId;


async function up() {
  await models.GenderType.create([
    {
      _id: new mongoose.Types.ObjectId('000000000000000000000000'),
      description: "f",
    },
    {
      _id: new mongoose.Types.ObjectId('000000000000000000000001'),
      description: "m",
    },
    {
      _id: new mongoose.Types.ObjectId('000000000000000000000002'),
      description: "x",
    },
  ])

  await models.CurrencyType.create([
    {
      _id: new mongoose.Types.ObjectId('000000000000000000000000'),
      description: "ars",
    },
    {
      _id: new mongoose.Types.ObjectId('000000000000000000000001'),
      description: "usd",
    },
  ])

  await models.MovementType.create([
    {
      _id: new mongoose.Types.ObjectId('000000000000000000000000'),
      description: "transferencia",
    },
    {
      _id: new mongoose.Types.ObjectId('000000000000000000000001'),
      description: "deposito",
    },
    {
      _id: new mongoose.Types.ObjectId('000000000000000000000002'),
      description: "extraccion",
    },
  ])

  await models.ProductType.create([
    {
      _id: new mongoose.Types.ObjectId('000000000000000000000000'),
      description: "ca",
    },
    {
      _id: new mongoose.Types.ObjectId('000000000000000000000001'),
      description: "cc",
    },
  ])

  await models.PersonType.create([
    {
      _id: new mongoose.Types.ObjectId('000000000000000000000000'),
      description: "f",
    },
    {
      _id: new mongoose.Types.ObjectId('000000000000000000000001'),
      description: "j",
    },
  ])
}

async function down() {
  await models.GenderType.deleteMany({
    _id: ['000000000000000000000000','000000000000000000000001', '000000000000000000000002'],
  });

  await models.CurrencyType.deleteMany({
    _id: ['000000000000000000000000','000000000000000000000001'],
  });

  await models.MovementType.deleteMany({
    _id: ['000000000000000000000000','000000000000000000000001', '000000000000000000000002'],
  });

  await models.ProductType.deleteMany({
    _id: ['000000000000000000000000','000000000000000000000001'],
  });

  await models.PersonType.deleteMany({
    _id: ['000000000000000000000000','000000000000000000000001'],
  });
}

module.exports = { up, down };
