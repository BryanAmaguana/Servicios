const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let TarjetaSchema = new Schema({
    id_tarjeta: {
        type: String,
        unique: true,
        required: [true, "Id de la tarjeta Obligatorio"]
    },

    Valor_tarjeta: {
        type: double,
        required: [true, "Valor Obligatorio"]
    },

    Activo: {
        type: String,
        required: [true, "Disponibilidad Obligatorio"]
    },

    Descripcion: {
        type: String,
        required: false
    },

});

TarjetaSchema.plugin(uniqueValidator, { message: 'Id de la tarjata ya registrado' });

module.exports = mongoose.model('Tarjeta', TarjetaSchema);