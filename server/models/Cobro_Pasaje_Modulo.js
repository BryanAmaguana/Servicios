const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let Cobro_pasajeSchema = new Schema({

    codigo_tarjeta: {
        type: String,
        required: [true, "Codigo de la tarjeta Obligatorio"]
    },

    numero_bus_cobro: {
        type: String,
        required: [true, "Numero bus Obligatorio"]
    },

    fecha_hora_cobro: {
        type: Date,
        required: [true, "fecha de cobro Obligatorio"]
    },

    valor_pagado: {
        type: Number,
        require: [true, 'Valor Obligatorio']
    }
});

module.exports = mongoose.model('cobro_pasaje', Cobro_pasajeSchema);