const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let TipoSchema = new Schema({

    nombre: {
        type: String,
        required: [true, "Nombre Obligatorio"]
    },

    valor: {
        type: Number,
        required: [true, "Valor Obligatorio"]
    },

    descripcion: {
        type: String,
        required: false
    },

    disponible: {
        type: Boolean,
        required: [true, "Disponibilidad Obligatorio"]
    }

});

module.exports = mongoose.model('Tipo_pasajero', TipoSchema);