const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let RecorridoSchema = new Schema({
    numero_bus_recorrido: {
        type: Number,
        required: [true, "Numero del bus Obligatorio"]
    },

    id_recorrido: {
        type: String,
        required: [true, "id del recorrido Obligatorio"]
    },

    apellido_persona: {
        type: String,
        required: [true, "Id de la ruta Obligatorio"]
    },

    Fecha_inicio_recorrido: {
        type: Date,
        required: [true, 'Fecha de inicio Obligatorio']
    },

    Fecha_fin_recorrido: {
        type: Date,
        required: [true, "Fecha de finalizacion Obligatoria"]
    },

});

module.exports = mongoose.model('Recorrido', RecorridoSchema);