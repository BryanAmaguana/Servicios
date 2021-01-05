const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let RutaSchema = new Schema({
    nombre_ruta: {
        type: String,
        required: [true, "Nombre de la ruta Obligatoria"]
    },

    Descripcion: {
        type: String,
        required: false
    },

});

module.exports = mongoose.model('Ruta', RutaSchema);