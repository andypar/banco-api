const { models } = require("../db");

async function up() {
  await models.GenderType.create([
    {
      description: "f",
    },
    {
      description: "m",
    },
    {
      description: "x",
    },
  ])

  await models.CurrencyType.create([
    {
      description: "ars",
    },
    {
      description: "usd",
    },
  ])

  await models.MovementType.create([
    {
      description: "transferencia",
    },
    {
      description: "deposito",
    },
    {
      description: "extraccion",
    },
  ])

  await models.ProductType.create([
    {
      description: "ca",
    },
    {
      description: "cc",
    },
  ])

  await models.PersonType.create([
    {
      description: "f",
    },
    {
      description: "j",
    },
  ])
}

async function down() {
  await models.GenderType.deleteMany({
    description: ["f", "m", "x"],
  });

  await models.CurrencyType.deleteMany({
    description: ["ars", "usd"],
  });

  await models.MovementType.deleteMany({
    description: ["transferencia", "deposito", "extraccion"],
  });

  await models.ProductType.deleteMany({
    description: ["ca", "cc"],
  });

  await models.PersonType.deleteMany({
    description: ["f", "j"],
  });
}

module.exports = { up, down };
