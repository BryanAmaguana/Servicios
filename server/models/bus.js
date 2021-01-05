const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let BusSchema = new Schema({
    numero_bus: {
        type: Number,
        unique: true,
        required: [true, "Numero Obligatorio"]
    },

    cedula_dueno_bus: {
        type: String,
        required: [true, "Dueño Obligatorio"]
    },

    placa_bus: {
        type: String,
        required: false
    },
});

PersonaSchema.plugin(uniqueValidator, { message: 'Numero de Bus ya registrado' });

module.exports = mongoose.model('Bus', BusSchema);