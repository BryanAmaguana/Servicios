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
        required: false
    },

    codigo_tarjeta: {
        type: String,
        required: false
    },

    nombre_usuario: {
        type: String,
        required: [true, "id del usuario requerido"]
    },

});


module.exports = mongoose.model('Recargas', RecargasSchema);