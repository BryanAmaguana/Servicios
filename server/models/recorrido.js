const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let RecorridoSchema = new Schema({
    numero_bus_recorrido: {
        type: Schema.ObjectId,
        ref: 'Bus',
        required: [true, "Numero del bus Obligatorio"]
    },

    id_Ruta_recorrido: {
        type: Schema.ObjectId,
        ref: 'Ruta',
        required: [true, "id de la ruta Obligatorio"]
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