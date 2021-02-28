const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let BusSchema = new Schema({
    numero_bus: {
        type: Number,
        unique: true,
        required: [true, "Numero Obligatorio"]
    },

    id_persona: {
        type: Schema.ObjectId,
        ref: 'Persona',
        required: [true, "Dueño Obligatorio"]

    },

    placa_bus: {
        type: String,
        required: false
    },

    disponible: {
        type: Boolean,
        required: [true, "Disponibilidad Obligatorio"]
    },

});

BusSchema.plugin(uniqueValidator, { message: 'Numero de Bus ya registrado' });

module.exports = mongoose.model('Bus', BusSchema);