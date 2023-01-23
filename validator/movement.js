
movementValidator = async (req, res, next) => {

    // Balance
    req.check("balance", "El monto no puede estar vacío").notEmpty();
    req.check("balance", "El monto debe ser superior a $10").isInt({ min:10});

    // check for errors
    const errors = await req.validationErrors();
    if (errors) {
      const firstError = errors.map((error) => error.msg)[0];
      return res.status(400).json({ error: firstError });
    }
  
    // sigue con siguiente middleware
    next();
  };
  
  module.exports = movementValidator;