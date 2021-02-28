const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let RolSchema = new Schema({

    nombre: {
        type: String,
        unique: true,
        required: [true, "Nombre Obligatorio"]
    },

    descripcion: {
        type: String,
        required: false
    }
});

RolSchema.plugin(uniqueValidator, { message: 'Nombre de rol ya registrado' });
module.exports = mongoose.model('Rol', RolSchema);