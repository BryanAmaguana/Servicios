const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let RutaSchema = new Schema({
    numero_ruta: {
        type: String,
        required: [true, "Numero de ruta Obligatoria"]
    },

    nombre_ruta: {
        type: String,
        required: [true, "Nombre de la ruta Obligatoria"]
    },

    descripcion: {
        type: String,
        required: false
    },

    disponible: {
        type: Boolean,
        required: [true, "Disponiblilidad Obligatoria"]
    },

});

module.exports = mongoose.model('Ruta', RutaSchema);