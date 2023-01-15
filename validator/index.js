
exports.createUserValidator = (req, res, next) => {

    //Usuario
    req.check('userName', "Escribe el nombre de usuario").notEmpty();
    req.check('userName', "El usuario debe ser un correo").isEmail();
    req.check('userName', "El usuario debe tener entre 4 y 20 caracteres").isLength({
        min: 4, max: 20
    });

    //Contraseña
    req.check('password', "Escribe una contraseña").notEmpty();
    req.check('password', "La contraseña debe ser una combinación de una mayúscula, una minúscula, un carácter especial, un dígito y un mínimo de 8, un máximo de 20 caracteres de largo").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i");

    // check for errors
    const errors = req.validationErrors()
    if(errors){
        const firstError = errors.map((error) => error.msg)[0]
        return res.status(400).json({ error: firstError })

    };
    

    // sigue con siguiente middleware
    next();

};