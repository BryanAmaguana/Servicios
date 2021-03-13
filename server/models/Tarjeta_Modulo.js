const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let TarjetaSchema = new Schema({

    codigo: {
        type: String,
        unique: true,
        required: [true, "Codigo Obligatorio"]
    },

    valor_tarjeta: {
        type: Number,
        required: [true, "Valor Obligatorio"]
    },

    disponible: {
        type: Boolean,
        required: [true, "Disponibilidad Obligatorio"]
    },

    descripcion: {
        type: String,
        required: false
    }
});

TarjetaSchema.plugin(uniqueValidator, { message: 'Codigo de tarjeta ya registrado' });

module.exports = mongoose.model('Tarjeta', TarjetaSchema);