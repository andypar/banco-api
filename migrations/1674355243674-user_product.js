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
        { _id: "000000000000000000000000" },
        { _id: "000000000000000000000002" },
      ],
      cuilCuit: "27344013271",
      isActive: true,
      role: "000000000000000000000002", //user
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new mongoose.Types.ObjectId("000000000000000000000001"),
      name: {
        firstName: "Andrea P.",
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
        { _id: "000000000000000000000001" },
        { _id: "000000000000000000000003" },
      ],
      cuilCuit: "27344013281",
      isActive: true,
      role: "000000000000000000000002", //user
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new mongoose.Types.ObjectId("000000000000000000000002"),
      name: {
        firstName: "Usuario",
        lastName: "Prueba",
      },
      gender: "000000000000000000000001", //m
      dni: "123456711",
      dateBirth: "1988-12-29",
      email: "usuario@mail.com",
      username: "usuario",
      password: hashedPassword,
      telephone: "1564078964",
      personType: "000000000000000000000000", //f
      products: [{ _id: "000000000000000000000009" }],
      cuilCuit: "30123456111",
      isActive: true,
      role: "000000000000000000000002", //user
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new mongoose.Types.ObjectId("000000000000000000000003"),
      name: {
        firstName: "Sociedad SRL",
        lastName: "Sociedad",
      },
      gender: "000000000000000000000002", //i
      dni: "34401330",
      dateBirth: "1988-12-30",
      email: "sociedad@mail.com",
      username: "sociedad",
      password: hashedPassword,
      telephone: "1564078964",
      personType: "000000000000000000000001", //j
      products: [
        { _id: "000000000000000000000004" },
        { _id: "000000000000000000000001" },
        { _id: "000000000000000000000006" },
        { _id: "000000000000000000000007" },
      ],
      cuilCuit: "30344013301",
      isActive: true,
      role: "000000000000000000000002", //user
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new mongoose.Types.ObjectId("000000000000000000000004"),
      name: {
        firstName: "Empresa",
        lastName: "Empresa",
      },
      gender: "000000000000000000000002", //i
      dni: "12345678",
      dateBirth: "1988-12-29",
      email: "empresa@mail.com",
      username: "empresa",
      password: hashedPassword,
      telephone: "1564078964",
      personType: "000000000000000000000001", //j
      products: [],
      cuilCuit: "30123456781",
      isActive: true,
      role: "000000000000000000000002", //user
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new mongoose.Types.ObjectId("000000000000000000000005"),
      name: {
        firstName: "Pyme",
        lastName: "Pyme",
      },
      gender: "000000000000000000000002", //i
      dni: "123456710",
      dateBirth: "1988-12-29",
      email: "pyme@pyme.com",
      username: "pyme1",
      password: hashedPassword,
      telephone: "1564078964",
      personType: "000000000000000000000001", //j
      products: [{ _id: "000000000000000000000008" }],
      cuilCuit: "30123456101",
      isActive: true,
      role: "000000000000000000000002", //user
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new mongoose.Types.ObjectId("000000000000000000000006"),
      name: {
        firstName: "Test",
        lastName: "Test",
      },
      gender: "000000000000000000000002", //i
      dni: "123456712",
      dateBirth: "1988-12-29",
      email: "test@user.com",
      username: "testuser",
      password: hashedPassword,
      telephone: "1564078964",
      personType: "000000000000000000000001", //j
      products: [],
      cuilCuit: "30123456121",
      isActive: true,
      role: "000000000000000000000002", //user
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new mongoose.Types.ObjectId("000000000000000000000007"),
      name: {
        firstName: "Admin",
        lastName: "Admin",
      },
      gender: "000000000000000000000000", //f
      dni: "123456789",
      dateBirth: "1988-12-29",
      email: "admin@admin.com",
      username: "admin",
      password: hashedPassword,
      telephone: "1564078964",
      personType: "000000000000000000000000", //f
      products: [],
      cuilCuit: "27123456791",
      isActive: true,
      role: "000000000000000000000000", //admin
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new mongoose.Types.ObjectId("000000000000000000000008"),
      name: {
        firstName: "Employee",
        lastName: "Employee",
      },
      gender: "000000000000000000000000", //f
      dni: "11111111",
      dateBirth: "1988-12-29",
      email: "employee@employee.com",
      username: "employee",
      password: hashedPassword,
      telephone: "1564078964",
      personType: "000000000000000000000000", //f
      products: [],
      cuilCuit: "27111111111",
      isActive: true,
      role: "000000000000000000000001", //employee
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
      "000000000000000000000004",
      "000000000000000000000005",
      "000000000000000000000006",
      "000000000000000000000007",
      "000000000000000000000008",
    ],
  });
}

module.exports = { up, down };
