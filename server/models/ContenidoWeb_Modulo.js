const mongoose = require('mongoose');
/* const uniqueValidator = require('mongoose-unique-validator'); */

let Schema = mongoose.Schema;

let ContenidoSchema = new Schema({
    nombre: {
        type: String,
        required: false
    },

    mensaje_Inicio: {
        type: String,
        required: false
    },

    mensaje_Inicio2: {
        type: String,
        required: false
    },

    descripcion: {
        type: String,
        required: false
    },

    correo: {
        type: String,
        required: false
    },

    telefono: {
        type: String,
        required: false
    },

    Celular: {
        type: String,
        required: false
    },

    fax: {
        type: String,
        required: false
    },

    direccion: {
        type: String,
        required: false
    },

    mision: {
        type: String,
        required: false
    },

    vision: {
        type: String,
        required: false
    },

    historia: {
        type: String,
        required: false
    }

});


module.exports = mongoose.model('Contenido', ContenidoSchema);