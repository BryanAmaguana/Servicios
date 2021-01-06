const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let PasajeroSchema = new Schema({
    cedula_persona_pasajero: {
        type: Schema.ObjectId,
        ref: 'Persona',
        unique: true,
        required: [true, "Id de la persona  Obligatorio"]
    },

    id_tarjeta_pasajero: {
        type: Schema.ObjectId,
        ref: 'Tarjeta',
        required: [true, " Id de la tarjeta Obligatorio"]
    },

    valor_pasaje_pasajero: {
        type: Number,
        required: [true, " Valor del pasaje obligatorio"]
    },

    pasaje_especial_pasajero: {
        type: String,
        required: [true, "Pasaje especial obligatorio"]
    },

});

PasajeroSchema.plugin(uniqueValidator, { message: 'Numero de cedula ya registrado' });

module.exports = mongoose.model('Pasajero', PasajeroSchema);