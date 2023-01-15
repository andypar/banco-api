const mongoose = require("mongoose");
mongoose.set('strictQuery', false);

// db
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("DB Connected"))

mongoose.connection.on('error', err => {
    console.log(`Error de conexion: ${err.message}`);
});

