const mongoose = require('mongoose');
/* const uniqueValidator = require('mongoose-unique-validator'); */

let Schema = mongoose.Schema;

let MenuSchema = new Schema({
    titulo: {
        type: String,
        required: [true, "Titulo Requerido"]
    },

    url: {
        type: String,
        required: [true, "url Requerido"]
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


module.exports = mongoose.model('Menu', MenuSchema);