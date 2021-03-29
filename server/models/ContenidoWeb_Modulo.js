const mongoose = require('mongoose');
/* const uniqueValidator = require('mongoose-unique-validator'); */

let Schema = mongoose.Schema;

let ContenidoSchema = new Schema({
    titulo: {
        type: String,
        required: [true, "Titulo Requerido"]
    },

    contenido: {
        type: String,
        required: [true, "url Requerido"]
    },

    fondo: {
        type: String,
        required: false
    },

    order: {
        type: String,
        required: false
    },

    disponible: {
        type: Boolean,
        required: [true, "Disponiblilidad Obligatoria"]
    }
});


module.exports = mongoose.model('Contenido', ContenidoSchema);