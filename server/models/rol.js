const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let RolSchema = new Schema({
    id_rol: {
        type: String,
        unique: true,
        required: [true, "id del rol Obligatorio"]
    },

    nombre_rol: {
        type: String,
        required: [true, "Nombre Obligatorio"]
    },

    descripcion: {
        type: String,
        required: false
    },
});

module.exports = mongoose.model('Rol', RolSchema);