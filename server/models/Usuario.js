const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;

let UsuarioSchema = new Schema({
    Nombre_usuario: {
        type: String,
        required: [true, "Nombre del rol Obligatorio"]
    },

    Contrasena: {
        type: String,
        required: [true, "contrasena requerida"]
    },

    cedula_persona: {
        type: String,
        unique: true,
        required: [true, "Id de la persona Obligatorio"]
    },

    fecha_registro_Usuario: {
        type: Date,
        required: [true, "Fecha de registro obligatoria"]
    },

});

PersonaSchema.plugin(uniqueValidator, { message: 'Numero de cedula ya registrado' });

module.exports = mongoose.model('Persona', PersonaSchema);