const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let TipoSchema = new Schema({

    nombre: {
        type: String,
        unique: true,
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

TipoSchema.plugin(uniqueValidator, { message: 'Tipo de pasajero ya registrado' });

module.exports = mongoose.model('Tipo_pasajero', TipoSchema);