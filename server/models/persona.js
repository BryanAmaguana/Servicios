const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let PersonaSchema = new Schema({
    cedular_persona: {
        type: String,
        unique: true,
        required: [true, "Nombre Obligatorio"]
    },

    nombre_persona: {
        type: String,
        required: [true, "Nombre Obligatorio"]
    },

    apellido_persona: {
        type: String,
        required: [true, "Nombre Obligatorio"]
    },

    direccion_persona: {
        type: String,
        required: false
    },

    celular_persona: {
        type: String,
        required: [true, "Numero Celular Obligatorio"]
    },

    fecha_nacimiento_persona: {
        type: Date,
        required: [true, "Fecha de Nacimiento Obligatorio"]
    }
});

PersonaSchema.plugin(uniqueValidator, { message: 'Numero de cedula ya registrado' });

module.exports = mongoose.model('Persona', PersonaSchema);