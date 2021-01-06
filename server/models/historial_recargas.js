const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let RecargadorSchema = new Schema({
    fecha_hora_Accion: {
        type: Date,
        required: [true, "Fecha hora Obligatorio"]
    },

    accion_recargador: {
        type: String,
        required: [true, "Accion Obligatoria"]
    },

    Valor_recarga: {
        type: String,
        required: false
    },

    id_tarjeta_recargada: {
        type: String,
        required: false
    },

    id_usuario: {
        type: String,
        required: [true, "Id  Obligatorio"]
    },

});


module.exports = mongoose.model('Recargador', RecargadorSchema);