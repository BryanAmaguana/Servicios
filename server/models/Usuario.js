const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;

let UsuarioSchema = new Schema({
    nombre_usuario: {
        type: String,
        unique: true,
        required: [true, "Nombre del usuario Obligatorio"]
    },

    contrasena: {
        type: String,
        required: [true, "contrasena requerida"]
    },

    correo: {
        type: String,
        required: [true, "correo requerida"]
    },

    id_persona: {
        type: Schema.ObjectId,
        ref: 'Persona',
        required: [true, "id obligatorio"]
    },

    id_rol: {
        type: Schema.ObjectId,
        ref: 'Rol',
        required: [true, "Rol Obligatorio"]
    },

    fecha_registro_Usuario: {
        type: String,
        required: false
    },

    disponible: {
        type: Boolean,
        required: [true, "Disponibilidad Obligatorio"]
    },
    
    avatar: {
        type: String,
        required: false
    }

});

UsuarioSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.contrasena;

    return userObject;
}

UsuarioSchema.plugin(uniqueValidator, { message: 'Nombre de usuario ya registrado' });

module.exports = mongoose.model('Usuario', UsuarioSchema);