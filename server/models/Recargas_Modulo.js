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

    id_tarjeta_recargada: {
        type: Schema.ObjectId,
        ref: 'Tarjeta',
        required: false
    },

    id_usuario: {
        type: Schema.ObjectId,
        ref: 'Usuario',
        required: [true, "id del usuario requerido"]
    },

});


module.exports = mongoose.model('Recargas', RecargasSchema);