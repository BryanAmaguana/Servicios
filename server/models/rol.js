const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let RolSchema = new Schema({

    nombre: {
        type: String,
        required: [true, "Nombre Obligatorio"]
    },

    descripcion: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Rol', RolSchema);