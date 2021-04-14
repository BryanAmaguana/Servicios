const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let Cobro_pasajeSchema = new Schema({

    id_tarjeta: {
        type: Schema.ObjectId,
        ref: 'Tarjeta',
        required: [true, "id de la tarjeta Obligatorio"]
    },

    id_bus_cobro: {
        type: Schema.ObjectId,
        ref: 'Bus',
        required: [true, "id bus Obligatorio"]
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