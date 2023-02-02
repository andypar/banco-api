const logger = require("../logger");

movementValidator = async (req, res, next) => {
  // Balance
  req.check("balance", "El monto no puede estar vacío").notEmpty();
  req.check("balance", "El monto debe ser superior a $10").isInt({ min: 10 });
  req
    .check("balance", "El monto debe ser inferior a $1.000.000")
    .isInt({ max: 1000000 });

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

module.exports = movementValidator;
