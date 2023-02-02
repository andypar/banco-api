const { models } = require("../db");

createUserValidator = async (req, res, next) => {
  // First Name
  req.check("name.firstName", "El nombre no puede estar vacío").notEmpty();

  // Last Name
  req.check("name.lastName", "El apellido no puede estar vacío").notEmpty();

  // DNI
  req.check("dni", "El DNI no puede estar vacío").notEmpty();
  req.check("dni", "El DNI debe ser numérico").isNumeric();
  req.check("dni", "El DNI debe tener como mínimo 7 carácteres").isLength({
    min: 7,
  });

  // Date Birth
  req.checkBody("dateBirth", "Fecha de Nacimiento Inválida").custom((value) => {
    if (!isValidDate(value)) {
      return false;
    }
    return true;
  });

  // Email
  req.check("email", "El email no puede estar vacío").notEmpty();
  req.check("email", "El formato del correo es erróneo").isEmail();
  req.check("email", "El correo debe tener como mínimo 5 carácteres").isLength({
    min: 5,
  });

  // Username
  req.check("username", "El usuario no puede estar vacío").notEmpty();
  req.check("username", "El usuario debe como mínimo 5 carácteres").isLength({
    min: 5,
  });

  // Password
  req.check("password", "La contraseña no puede estar vacío").notEmpty();
  req
    .check(
      "password",
      "La contraseña debe ser una combinación de una mayúscula, una minúscula, un carácter especial, un dígito y un mínimo de 8, un máximo de 20 caracteres de largo"
    )
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i");

  // Telephone
  req.check("telephone", "El teléfono no puede estar vacío").notEmpty();

  // CUI_CUIT
  req.check("cuilCuit", "El CUIT/CUIL no puede estar vacío").notEmpty();
  req
    .check("cuilCuit", "El CUIT/CUIL debe tener como mínimo 10 carácteres")
    .isLength({
      min: 10,
    });

  // check for errors
  const errors = await req.validationErrors();
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }

  // sigue con siguiente middleware
  next();
};

updateUserValidator = async (req, res, next) => {
  // First Name
  req.check("name.firstName", "El nombre no puede estar vacío").notEmpty();

  // Last Name
  req.check("name.lastName", "El apellido no puede estar vacío").notEmpty();

  // Date Birth
  req.checkBody("dateBirth", "Fecha de Nacimiento Inválida").custom((value) => {
    if (!isValidDate(value)) {
      return false;
    }
    return true;
  });

  // Email
  req.check("email", "El email no puede estar vacío").notEmpty();
  req.check("email", "El formato del correo es erróneo").isEmail();
  req.check("email", "El correo debe tener como mínimo 5 carácteres").isLength({
    min: 5,
  });

  // // Password
  // req.check("password", "La contraseña no puede estar vacía").notEmpty();
  // req
  //   .check(
  //     "password",
  //     "La contraseña debe ser una combinación de una mayúscula, una minúscula, un carácter especial, un dígito y un mínimo de 8, un máximo de 20 caracteres de largo"
  //   )
  //   .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i");

  // Telephone
  req.check("telephone", "El teléfono no puede estar vacío").notEmpty();

  // check for errors
  const errors = await req.validationErrors();
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    logger.warn(firstError);
    return res.status(400).json({ error: firstError });
  }

  // sigue con siguiente middleware
  next();
};

function isValidDate(dateString) {
  var regEx = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regEx)) return false; // Invalid format
  var d = new Date(dateString);
  var dNum = d.getTime();
  if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
  return d.toISOString().slice(0, 10) === dateString;
}

module.exports = { createUserValidator, updateUserValidator };
