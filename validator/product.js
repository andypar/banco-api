updateProductValidator = async (req, res, next) => {
  // Alias
  req.check("alias", "El alias no puede estar vacío").notEmpty();
  req.check("alias", "El alias debe tener como mínimo 5 carácteres").isLength({
    min: 5,
  });

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

module.exports = updateProductValidator;
