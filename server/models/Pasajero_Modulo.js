const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let PasajeroSchema = new Schema({
    id_persona: {
        type: Schema.ObjectId,
        ref: 'Persona',
        unique: true,
        required: [true, "Id de la persona  Obligatorio"]
    },
    cedula_persona: {
        type: String,
        required: [true, "Cédula Obligatoria"]
    },

    id_tarjeta_pasajero: {
        type: Schema.ObjectId,
        ref: 'Tarjeta',
        required: [true, " Id de la tarjeta Obligatorio"]
    },

    id_tipo_pasajero: {
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