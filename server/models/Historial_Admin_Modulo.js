const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let Historial_adminSchema = new Schema({
    fecha_accion: {
        type: Date,
        required: [true, "Fecha requerida"]
    },

    accion_admin: {
        type: String,
        required: false
    },

    descripcion: {
        type: String,
        required: false
    },

    id_usuario: {
        type: Schema.ObjectId,
        ref: 'Usuario',
        required: [true, "id del usuario requerido"]
    },

});


module.exports = mongoose.model('Historial_admin', Historial_adminSchema);