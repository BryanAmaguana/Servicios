const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let Historial_RecargadoresSchema = new Schema({
    fecha_accion: {
        type: Date,
        required: [true, "Fecha requerida"]
    },

    accion_recargador: {
        type: String,
        required: false
    },

    descripcion: {
        type: String,
        required: false
    },

    id_usuario: {
        type: String,
        required: [true, "id del usuario requerido"]
    },

});


module.exports = mongoose.model('Historial_Recargadores', Historial_RecargadoresSchema);