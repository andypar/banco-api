const { models } = require("../db");
const mongoose = require("mongoose");

async function up() {
  await models.Movement.create([
    {
      _id: "000000000000000000000000",
      accountFrom: "000000000000000000000008",
      balance: 20000,
      totalBalance: 10000,
      type: "000000000000000000000001", //extracción
      descriptionMovement: "Saco Mas Plata",
      createdAt: "2023-02-23T00:53:37.134Z",
      updatedAt: "2023-02-23T00:53:37.134Z",
    },
    {
      _id: "000000000000000000000001",
      accountFrom: "000000000000000000000008",
      balance: 30000,
      totalBalance: 30000,
      type: "000000000000000000000000", // deposito
      descriptionMovement: "Ingreso Mas Dinero",
      createdAt: "2023-02-23T00:52:43.089Z",
      updatedAt: "2023-02-23T00:52:43.089Z",
    },
    {
      _id: "000000000000000000000002",
      accountFrom: "000000000000000000000008",
      balance: 7000,
      totalBalance: 0,
      type: "000000000000000000000001", // extracción
      descriptionMovement: "Saco lo que me queda",
      createdAt: "2023-02-23T00:52:20.665Z",
      updatedAt: "2023-02-23T00:52:20.665Z",
    },
    {
      _id: "000000000000000000000003",
      accountFrom: "000000000000000000000008",
      balance: 900,
      totalBalance: 7000,
      type: "000000000000000000000001", //"extracción"
      descriptionMovement: "Saco Mas Plata",
      createdAt: "2023-02-23T00:51:02.376Z",
      updatedAt: "2023-02-23T00:51:02.376Z",
    },
    {
      _id: "000000000000000000000004",
      accountFrom: "000000000000000000000008",
      balance: 50,
      totalBalance: 7900,
      type: "000000000000000000000001", // "extracción"
      descriptionMovement: "Saco",
      createdAt: "2023-02-23T00:50:50.207Z",
      updatedAt: "2023-02-23T00:50:50.207Z",
    },
    {
      _id: "000000000000000000000005",
      accountFrom: "000000000000000000000008",
      balance: 1000,
      totalBalance: 7950,
      type: "000000000000000000000001", // "description"
      descriptionMovement: "Saco Otra Vez",
      createdAt: "2023-02-23T00:50:38.125Z",
      updatedAt: "2023-02-23T00:50:38.125Z",
    },
    {
      _id: "000000000000000000000006",
      accountFrom: "000000000000000000000008",
      balance: 50,
      totalBalance: 8950,
      type: "000000000000000000000001", // "extracción"
      descriptionMovement: "Saco de Nuevo",
      createdAt: "2023-02-23T00:50:26.455Z",
      updatedAt: "2023-02-23T00:50:26.455Z",
    },
    {
      _id: "000000000000000000000007",
      accountFrom: "000000000000000000000008",
      balance: 1000,
      totalBalance: 9000,
      type: "000000000000000000000001", //"extracción"
      descriptionMovement: "Saco Primera Vez",
      createdAt: "2023-02-23T00:50:14.050Z",
      updatedAt: "2023-02-23T00:50:14.050Z",
    },
    {
      _id: "000000000000000000000008",
      accountFrom: "000000000000000000000008",
      balance: 10000,
      totalBalance: 10000,
      type: "000000000000000000000000", //"depósito"
      descriptionMovement: "Ingreso Dinero",
      createdAt: "2023-02-23T00:49:57.948Z",
      updatedAt: "2023-02-23T00:49:57.948Z",
    },

    {
      _id: "000000000000000000000009",
      accountFrom: "000000000000000000000008",
      balance: 10000,
      totalBalance: 0,
      type: "000000000000000000000001", // deposito
      descriptionMovement: "Saco Otro Dia",
      createdAt: "2023-02-02T00:52:43.089Z",
      updatedAt: "2023-02-02T00:52:43.089Z",
    },

    {
      _id: "000000000000000000000010",
      accountFrom: "000000000000000000000008",
      balance: 10000,
      totalBalance: 10000,
      type: "000000000000000000000001", // deposito
      descriptionMovement: "Saco Otro Dia",
      createdAt: "2023-01-25T00:52:43.089Z",
      updatedAt: "2023-01-25T00:52:43.089Z",
    },

    {
      _id: "000000000000000000000011",
      accountFrom: "000000000000000000000008",
      balance: 10000,
      totalBalance: 20000,
      type: "000000000000000000000001", // deposito
      descriptionMovement: "Saco Otro Dia",
      createdAt: "2023-01-24T00:52:43.089Z",
      updatedAt: "2023-01-24T00:52:43.089Z",
    },
    {
      _id: "000000000000000000000012",
      accountFrom: "000000000000000000000008",
      balance: 30000,
      totalBalance: 30000,
      type: "000000000000000000000000", // deposito
      descriptionMovement: "Ingreso Mas Dinero",
      createdAt: "2023-01-23T00:52:43.089Z",
      updatedAt: "2023-01-23T00:52:43.089Z",
    },
    {
      _id: "000000000000000000000013",
      accountFrom: "000000000000000000000008",
      balance: 7000,
      totalBalance: 0,
      type: "000000000000000000000001", // extracción
      descriptionMovement: "Saco lo que me queda",
      createdAt: "2023-01-23T00:52:20.665Z",
      updatedAt: "2023-01-23T00:52:20.665Z",
    },
    {
      _id: "000000000000000000000014",
      accountFrom: "000000000000000000000008",
      balance: 900,
      totalBalance: 7000,
      type: "000000000000000000000001", //"extracción"
      descriptionMovement: "Saco Mas Plata",
      createdAt: "2023-01-23T00:51:02.376Z",
      updatedAt: "2023-01-23T00:51:02.376Z",
    },
    {
      _id: "000000000000000000000015",
      accountFrom: "000000000000000000000008",
      balance: 50,
      totalBalance: 7900,
      type: "000000000000000000000001", // "extracción"
      descriptionMovement: "Saco",
      createdAt: "2023-01-23T00:50:50.207Z",
      updatedAt: "2023-01-23T00:50:50.207Z",
    },
    {
      _id: "000000000000000000000016",
      accountFrom: "000000000000000000000008",
      balance: 1000,
      totalBalance: 7950,
      type: "000000000000000000000001", // "description"
      descriptionMovement: "Saco Otra Vez",
      createdAt: "2023-01-23T00:50:38.125Z",
      updatedAt: "2023-01-23T00:50:38.125Z",
    },
    {
      _id: "000000000000000000000017",
      accountFrom: "000000000000000000000008",
      balance: 50,
      totalBalance: 8950,
      type: "000000000000000000000001", // "extracción"
      descriptionMovement: "Saco de Nuevo",
      createdAt: "2023-01-23T00:50:26.455Z",
      updatedAt: "2023-01-23T00:50:26.455Z",
    },
    {
      _id: "000000000000000000000018",
      accountFrom: "000000000000000000000008",
      balance: 1000,
      totalBalance: 9000,
      type: "000000000000000000000001", //"extracción"
      descriptionMovement: "Saco Primera Vez",
      createdAt: "2023-01-23T00:50:14.050Z",
      updatedAt: "2023-01-23T00:50:14.050Z",
    },
    {
      _id: "000000000000000000000019",
      accountFrom: "000000000000000000000008",
      balance: 10000,
      totalBalance: 10000,
      type: "000000000000000000000000", //"depósito"
      descriptionMovement: "Ingreso Dinero",
      createdAt: "2023-01-23T00:49:57.948Z",
      updatedAt: "2023-01-23T00:49:57.948Z",
    },
  ]);
}

async function down() {
  await models.Movement.deleteMany({
    _id: [
      "000000000000000000000000",
      "000000000000000000000001",
      "000000000000000000000002",
      "000000000000000000000003",
      "000000000000000000000004",
      "000000000000000000000005",
      "000000000000000000000006",
      "000000000000000000000007",
      "000000000000000000000008",
      "000000000000000000000009",
      "000000000000000000000010",
      "000000000000000000000011",
      "000000000000000000000012",
      "000000000000000000000013",
      "000000000000000000000014",
      "000000000000000000000015",
      "000000000000000000000016",
      "000000000000000000000017",
      "000000000000000000000018",
      "000000000000000000000019",
    ],
  });
}

module.exports = { up, down };
