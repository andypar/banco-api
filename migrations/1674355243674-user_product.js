const { models } = require("../db");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

async function up() {
  const hashedPassword = await bcrypt.hash("Perritos123!", 10);
  await models.User.create([
    {
      _id: new mongoose.Types.ObjectId("000000000000000000000000"),
      name: {
        firstName: "Andrea Paula",
        lastName: "Rodriguez",
      },
      gender: "000000000000000000000000", //f
      dni: "34401327",
      dateBirth: "1988-12-29",
      email: "andypar29@hotmail.com",
      username: "andypar29",
      password: hashedPassword,
      telephone: "1564078964",
      personType: "000000000000000000000000", //f
      products: [
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
      ],
      cuilCuit: "27-34401327-1",
      isActive: true,
      role: "000000000000000000000002", //user
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new mongoose.Types.ObjectId("000000000000000000000001"),
      name: {
        firstName: "Andrea Paula",
        lastName: "Rodriguez",
      },
      gender: "000000000000000000000000", //f
      dni: "34401328",
      dateBirth: "1988-12-28",
      email: "andypar28@hotmail.com",
      username: "andypar28",
      password: hashedPassword,
      telephone: "1564078964",
      personType: "000000000000000000000000", //f
      products: [
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
      ],
      cuilCuit: "27-34401328-1",
      isActive: true,
      role: "000000000000000000000002", //user
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new mongoose.Types.ObjectId("000000000000000000000002"),
      name: {
        firstName: "Andrea Paula",
        lastName: "Rodriguez",
      },
      gender: "000000000000000000000000", //f
      dni: "34401330",
      dateBirth: "1988-12-30",
      email: "andypar30@hotmail.com",
      username: "andypar30",
      password: hashedPassword,
      telephone: "1564078964",
      personType: "000000000000000000000001", //j
      products: [],
      cuilCuit: "27-34401330-1",
      isActive: true,
      role: "000000000000000000000002", //user
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new mongoose.Types.ObjectId("000000000000000000000003"),
      name: {
        firstName: "Admin",
        lastName: "Admin",
      },
      gender: "000000000000000000000000", //f
      dni: "12345678",
      dateBirth: "1988-12-29",
      email: "admin@admin.com",
      username: "andypar31",
      password: hashedPassword,
      telephone: "1564078964",
      personType: "000000000000000000000000", //f
      products: [],
      cuilCuit: "27-12345678-1",
      isActive: true,
      role: "000000000000000000000000", //admin
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

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
  ]);
}

async function down() {
  await models.User.deleteMany({
    _id: [
      "000000000000000000000000",
      "000000000000000000000001",
      "000000000000000000000002",
      "000000000000000000000003",
    ],
  });

  await models.Product.deleteMany({
    _id: [
      "000000000000000000000000",
      "000000000000000000000001",
      "000000000000000000000002",
      "000000000000000000000003",
    ],
  });
}

module.exports = { up, down };
