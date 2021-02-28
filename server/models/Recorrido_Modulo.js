const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let RecorridoSchema = new Schema({
    id_bus_recorrido: {
        type: Schema.ObjectId,
        ref: 'Bus',
        required: [true, "id del bus Obligatorio"]
    },

    id_ruta_recorrido: {
        type: Schema.ObjectId,
        ref: 'Ruta',
        required: [true, "id de la ruta Obligatorio"]
    },

    fecha_inicio_recorrido: {
        type: Date,
        required: [true, 'Fecha de inicio Obligatorio']
    },

    fecha_fin_recorrido: {
        type: Date,
        required: [true, "Fecha de finalizacion Obligatoria"]
    },

    disponible: {
        type: Date,
        required: [true, "Fecha de finalizacion Obligatoria"]
    },

});

module.exports = mongoose.model('Recorrido', RecorridoSchema);