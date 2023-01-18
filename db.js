
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);

// db
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("DB Connected"))

mongoose.connection.on('error', err => {
    console.log(`Error de conexion: ${err.message}`);
});


const { schemas } = require('./schemas')

const models = {}

models.Gender = mongoose.model('Gender', schemas.gender)
models.PersonType = mongoose.model('PersonType', schemas.personType)
//mongoose.model('Product', schemas.product)
models.User = mongoose.model('User', schemas.user)

const db = {}
db.models = models

module.exports = db

