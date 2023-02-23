const { models } = require("../db");
const mongoose = require("mongoose");

async function up() {
  await models.Product.create([
    {
      _id: new mongoose.Types.ObjectId("000000000000000000000000"),
      type: "000000000000000000000000", //ca
      currency: "000000000000000000000000", //ars
      accountNumber: "0929/01110051/25",
      cbu: "0150929201000110051256",
      alias: "andypar29",
      balanceAmount: "0",
      overdraftAmount: "0",
      extractionLimit: "10000",
      movements: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new mongoose.Types.ObjectId("000000000000000000000001"),
      type: "000000000000000000000000", //ca
      currency: "000000000000000000000001", //usd
      accountNumber: "0929/01110051/26",
      cbu: "0150929201000110051266",
      alias: "andypar28",
      balanceAmount: "0",
      overdraftAmount: "0",
      extractionLimit: "1000",
      movements: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new mongoose.Types.ObjectId("000000000000000000000002"),
      type: "000000000000000000000001", //cc
      currency: "000000000000000000000000", //ars
      accountNumber: "0929/01110051/27",
      cbu: "0150929201000110051276",
      alias: "andypar30",
      balanceAmount: "0",
      overdraftAmount: "5000",
      extractionLimit: "10000",
      movements: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new mongoose.Types.ObjectId("000000000000000000000003"),
      type: "000000000000000000000001", //cc
      currency: "000000000000000000000001", //usd
      accountNumber: "0929/01110051/28",
      cbu: "0150929201000110051286",
      alias: "andypar31",
      balanceAmount: "0",
      overdraftAmount: "5000",
      extractionLimit: "10000",
      movements: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new mongoose.Types.ObjectId("000000000000000000000004"),
      type: "000000000000000000000000", //ca
      currency: "000000000000000000000000", //ars
      accountNumber: "0929/01110051/29",
      cbu: "0150929201000110051296",
      alias: "empresa1",
      balanceAmount: "0",
      overdraftAmount: "0",
      extractionLimit: "10000",
      movements: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new mongoose.Types.ObjectId("000000000000000000000005"),
      type: "000000000000000000000000", //ca
      currency: "000000000000000000000001", //usd
      accountNumber: "0929/01110051/30",
      cbu: "0150929201000110051306",
      alias: "empresa2",
      balanceAmount: "0",
      overdraftAmount: "0",
      extractionLimit: "1000",
      movements: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new mongoose.Types.ObjectId("000000000000000000000006"),
      type: "000000000000000000000001", //cc
      currency: "000000000000000000000000", //ars
      accountNumber: "0929/01110051/31",
      cbu: "0150929201000110051316",
      alias: "empresa1cc",
      balanceAmount: "0",
      overdraftAmount: "5000",
      extractionLimit: "10000",
      movements: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new mongoose.Types.ObjectId("000000000000000000000007"),
      type: "000000000000000000000001", //cc
      currency: "000000000000000000000001", //usd
      accountNumber: "0929/01110051/32",
      cbu: "0150929201000110051326",
      alias: "empresa2cc",
      balanceAmount: "0",
      overdraftAmount: "5000",
      extractionLimit: "10000",
      movements: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new mongoose.Types.ObjectId("000000000000000000000008"),
      type: "000000000000000000000001", //cc
      currency: "000000000000000000000001", //usd
      accountNumber: "0929/01110051/33",
      cbu: "0150929201000110051336",
      alias: "pyme",
      balanceAmount: "10000",
      overdraftAmount: "15000",
      extractionLimit: "30000",
      movements: [
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
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new mongoose.Types.ObjectId("000000000000000000000009"),
      type: "000000000000000000000000", //ca
      currency: "000000000000000000000000", //ars
      accountNumber: "0929/01110051/34",
      cbu: "0150929201000110051346",
      alias: "usuario1",
      balanceAmount: "0",
      overdraftAmount: "0",
      extractionLimit: "50000",
      movements: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

async function down() {
  await models.Product.deleteMany({
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
    ],
  });
}

module.exports = { up, down };
