const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let TarjetaSchema = new Schema({

    codigo: {
        type: String,
        required: [true, "Codigo Obligatorio"]
    },

    valor_tarjeta: {
        type: Number,
        required: [true, "Valor Obligatorio"]
    },

    tipo: {
        type: String,
        required: [true, "Disponibilidad Obligatorio"]
    },


    disponible: {
        type: Boolean,
        required: [true, "Disponibilidad Obligatorio"]
    },

    descripcion: {
        type: String,
        required: false
    },

});

TarjetaSchema.plugin(uniqueValidator, { message: 'Id de la tarjata ya registrado' });

module.exports = mongoose.model('Tarjeta', TarjetaSchema);