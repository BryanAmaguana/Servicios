const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let Cobro_pasajeSchema = new Schema({

    id_pasajero: {
        type: Schema.ObjectId,
        ref: 'Pasajero',
        required: [true, "id del pasajero Obligatorio"]
    },

    Numero_bus_cobro: {
        type: Schema.ObjectId,
        ref: 'Bus',
        required: [true, "Numero del bus Obligatorio"]
    },

    fecha_hora_cobro: {
        type: Date,
        required: [true, "fecha de cobro Obligatorio"]
    },


});

module.exports = mongoose.model('Cobro_Pasaje', Cobro_pasajeSchema);