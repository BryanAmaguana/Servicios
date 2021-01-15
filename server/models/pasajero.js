const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let PasajeroSchema = new Schema({
    cedula_pasajero: {
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

    tipo_pasaje_pasajero: {
        type: Schema.ObjectId,
        ref: 'Tipo_pasajero',
        required: [true, "Tipo de pasajero obligatorio"]
    },

    disponible: {
        type: Boolean,
        required: [true, "Disponibilidad Obligatorio"]
    }
});

PasajeroSchema.plugin(uniqueValidator, { message: 'Numero de cedula ya registrado' });

module.exports = mongoose.model('Pasajero', PasajeroSchema);