const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let RecargasSchema = new Schema({
    fecha_hora_Accion: {
        type: Date,
        required: [true, "Fecha hora Obligatorio"]
    },

    valor_recarga: {
        type: Number,
        required: [true, "valor de la recarga requerido"]
    },

    codigo_tarjeta: {
        type: String,
        required: [true, "codigo de la tarjeta requerido"]
    },

    nombre_usuario: {
        type: String,
        required: [true, "nombre del usuario requerido"]
    },

});


module.exports = mongoose.model('Recargas', RecargasSchema);