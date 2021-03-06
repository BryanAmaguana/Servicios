const express = require('express');
const Usuario = require('../models/Usuario_Modulo');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const multipart = require('connect-multiparty');
const md_upload_avatar = multipart({ uploadDir: "./uploads/avatar" });
const fs = require("fs");
const path = require("path");
const { verificaToken, verificarRol } = require('../middlewares/autenticacion');
const Historial_admin = require('../models/Historial_Admin_Modulo');
const app = express();
const { AgregarHistorial } = require('../routes/historial_admin');


app.get('/Historial', function (req, res) {
    try {
        Historial_admin.find({}).populate('id_usuario').exec((err, Historial) => {
            if (err) {
                return res.status(400).send({ message: "No se encontro historial." });
            }
            res.json({
                historial: Historial
            });
        });

    } catch (error) {
        console.log("Error: Historial");
        console.log(error);

    }

});

/* Obtener todos los usuarios */

app.get('/ObtenerUsuario', verificaToken, function (req, res) {
    try {
        Usuario.find({}).sort({ nombre_usuario: 1 }).populate('id_persona').populate('id_rol').exec((err, usuario) => {
            if (err) {
                return res.status(400).send({ message: "No se encontro ningun usuario." });
            }
            res.json({
                usuario
            });
        });

    } catch (error) {
        console.log("Error: ObtenerUsuario");
        console.log(error);

    }

});

/* Obtener Usuario por el nombre Activos*/

app.get('/ObtenerUsuarioNombreActivo/:nombre_usuario', [verificaToken], (req, res) => {
    try {
        let nombre_usuario = req.params.nombre_usuario;
        Usuario.find({ nombre_usuario: { '$regex': `${nombre_usuario}`, '$options': 'i' } }).find({ disponible: true }).populate('id_persona').populate('id_rol').exec((err, usuario) => {
            if (err) {
                return res.status(400).send({ message: "No se encontro ningun usuario." });
            }
            res.json({
                usuario
            });
        });

    } catch (error) {
        console.log("Error: ObtenerUsuarioNombreActivo");
        console.log(error);

    }

});

app.get('/ObtenerUsuarioNombreUsuario/:nombre_usuario', [verificaToken], (req, res) => {
    try {
        let nombre_usuario = req.params.nombre_usuario;
        Usuario.find({ nombre_usuario: { '$regex': `${nombre_usuario}`, '$options': 'i' } }).populate('id_persona').populate('id_rol').exec((err, usuario) => {
            if (err) {
                return res.status(400).send({ message: "No se encontro ningun usuario." });
            }
            res.json({
                usuario
            });
        });

    } catch (error) {
        console.log("Error: ObtenerUsuarioNombreUsuario");
        console.log(error);

    }

});

/* Obtener Usuario por el nombre Inactivos*/

app.get('/ObtenerUsuarioNombreInactivo/:nombre_usuario', [verificaToken], (req, res) => {
    try {
        let nombre_usuario = req.params.nombre_usuario;
        Usuario.find({ nombre_usuario: { '$regex': `${nombre_usuario}`, '$options': 'i' } }).find({ disponible: false }).populate('id_persona').populate('id_rol').exec((err, usuario) => {
            if (err) {
                return res.status(400).send({ message: "No se encontro ningun usuario." });
            }
            res.json({
                usuario
            });
        });

    } catch (error) {
        console.log("Error: ObtenerUsuarioNombreInactivo");
        console.log(error);

    }

});

/* Obtener usuario activos */

app.get('/ObtenerUsuarioActivos/:disponible/:desde/:limite', [verificaToken], (req, res) => {
    try {
        let disponible = req.params.disponible;
        const desde = req.params.desde;
        const limite = req.params.limite;
        Usuario.find({ disponible: disponible }).skip(Number(desde)).limit(Number(limite)).sort({ nombre_usuario: 1 }).populate('id_persona').populate('id_rol').exec((err, usuario) => {
            if (err) {
                return res.status(400).send({ message: "No se encontro ningun usuario." });
            }
            res.json({
                usuario
            });
        });

    } catch (error) {
        console.log("Error: ObtenerUsuarioActivos");
        console.log(error);

    }


});



/* Obtener cantidad de Usuarios */

app.get('/CantidadUsuarios/:disponible', verificaToken, function (req, res) {
    try {
        let disponible = req.params.disponible;
        Usuario.find({ disponible: disponible })
            .exec((err, usuario) => {
                if (err) {
                    return res.status(400).send({ message: "No se encontro ningun usuario." });
                }
                //aqui va las condiciones para que cuente
                Usuario.count({}, (err, conteo) => {
                    res.json({
                        ok: true,
                        cuantos: conteo
                    });
                });
            });

    } catch (error) {
        console.log("Error: CantidadUsuarios");
        console.log(error);

    }

});

/* Metodo para validar Correo */

function validarEmail(correo) {
    try {
        var regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
        if (!regex.test(correo)) {
            return false;
        } else {
            return true;
        }

    } catch (error) {
        console.log("Error: validarEmail");
        console.log(error);

    }

}

/* Agregar un usuario */

app.post('/AgregarUsuario', [verificaToken, verificarRol], function (req, res) {
    try {
        const usuario = new Usuario();
        let usuariohistoria = req.user;
        const { nombre_usuario, contrasena, correo, id_persona, id_rol, fecha_registro_Usuario, contrasenaR, avatar } = req.body;
        usuario.nombre_usuario = nombre_usuario;
        usuario.correo = correo;
        usuario.id_persona = id_persona;
        usuario.id_rol = id_rol;
        usuario.fecha_registro_Usuario = fecha_registro_Usuario;
        usuario.disponible = true;
        usuario.avatar = avatar;

        if (!validarEmail(correo)) {
            res.status(404).send({ message: "Correo Invalido." });
        } else {
            if (!contrasena || !contrasenaR) {

            } else {
                if (contrasena !== contrasenaR) {
                    res.status(404).send({ message: "Las contrase??as no son iguales." });
                } else {
                    bcrypt.hash(contrasena, saltRounds, function (err, hash) {
                        if (err) {
                            res
                                .status(500)
                                .send({ message: "Error al encriptar la contrase??a." });
                        } else {
                            usuario.contrasena = hash;

                            usuario.save((err, userStored) => {
                                if (err) {
                                    res.status(500).send({ message: "El usuario ya existe." });
                                } else {
                                    if (!userStored) {
                                        res.status(404).send({ message: "Error al crear el usuario." });
                                    } else {
                                        res.status(200).send({ message: "Usuario creado exitosamente." });
                                        AgregarHistorial(usuariohistoria.id, "Creo el usuario: " + usuario.id);
                                    }
                                }
                            });
                        }
                    });
                }
            }
        }

    } catch (error) {
        console.log("Error:AgregarUsuario");
        console.log(error);

    }

});

/* Actualizar Usuario */

app.put('/ActualizarUsuario/:id', [verificaToken, verificarRol], function (req, res) {
    try {

        let userData = req.body;
        const params = req.params;
        let usuariohistoria = req.user;

        if (!validarEmail(userData.correo)) {
            return res.status(404).send({ message: "Correo Invalido." });
        }

        if (userData.contrasena != null) {
            bcrypt.hash(userData.contrasena, saltRounds, (err, hash) => {
                if (err) {
                    res.status(500).send({ message: "Error al encriptar la contrase??a." });
                } else {
                    if (!userData) {
                        res.status(404).send({ message: "No se encontro ningun usuario" });
                    } else {
                        userData.contrasena = hash;
                        Usuario.findByIdAndUpdate({ _id: params.id }, userData, (err, userUpdate) => {
                            if (err) {
                                res.status(500).send({ message: "Datos Duplicados." });
                            } else {
                                if (!userUpdate) {
                                    res
                                        .status(404)
                                        .send({ message: "No se ha encontrado ningun usuario." });
                                } else {
                                    res.status(200).send({ message: "Usuario actualizado correctamente." });
                                    AgregarHistorial(usuariohistoria.id, "Actualizo el usuario: " + params.id);
                                }
                            }
                        });
                    }
                }
            });
        } else {
            Usuario.findByIdAndUpdate({ _id: params.id }, userData, (err, userUpdate) => {
                if (err) {
                    res.status(500).send({ message: "Datos Duplicados." });
                } else {
                    if (!userUpdate) {
                        res
                            .status(404)
                            .send({ message: "No se ha encontrado ningun usuario." });
                    } else {
                        res.status(200).send({ message: "Usuario actualizado correctamente." });
                        AgregarHistorial(usuariohistoria.id, "Actualizo el usuario: " + params.id);
                    }
                }
            });
        }

    } catch (error) {
        console.log("Error: ActualizarUsuario");
        console.log(error);

    }
});

/* Eliminar un usuario */

app.delete('/BorrarUsuario/:id', [verificaToken, verificarRol], function (req, res) {

    try {
        const { id } = req.params;
        let usuariohistoria = req.user;

        Usuario.findByIdAndRemove(id, (err, userDeleted) => {
            if (err) {
                res.status(500).send({ message: "Error del servidor." });
            } else {
                if (!userDeleted) {
                    res.status(404).send({ message: "Usuario no encontrado." });
                } else {
                    res
                        .status(200)
                        .send({ message: "El usuario ha sido eliminado correctamente." });
                    AgregarHistorial(usuariohistoria.id, "Borro el usuario: " + id);
                }
            }
        });

    } catch (error) {
        console.log("Error: BorrarUsuarios");
        console.log(error);

    }

});

/* Actualizar el Avatar */

app.put('/ActualizarAvatar/:id', [verificaToken, md_upload_avatar], function (req, res) {
    try {

        const body = req.params;
        let usuariohistoria = req.user;
        Usuario.findById({ _id: body.id }, (err, userData) => {
            if (err) {
                res.status(500).send({ message: "Error del servidor." });
            } else {
                if (!userData) {
                    res.status(404).send({ message: "Nose ha encontrado ningun usuario." });
                } else {
                    let usuario = userData;
                    if (req.files) {
                        let filePath = req.files.avatar.path;
                        let fileSplit = filePath.split("/");
                        let fileName = fileSplit[2];

                        let extSplit = fileName.split(".");
                        let fileExt = extSplit[1];
                        /*               let fileName = now.getTime()+req.files.avatar.originalFilename;
                            
                                      let extSplit = fileName.split(".");
                                      let fileExt = extSplit[1]; */

                        if (fileExt !== "png" && fileExt !== "jpg") {
                            res.status(400).send({
                                message:
                                    "La extension de la imagen no es valida. (Extensiones permitidas: .png y .jpg)"
                            });
                        } else {
                            usuario.avatar = fileName;
                            Usuario.findByIdAndUpdate(
                                { _id: body.id },
                                usuario,
                                (err, userResult) => {
                                    if (err) {
                                        res.status(500).send({ message: "Error del servidor." });
                                    } else {
                                        if (!userResult) {
                                            res
                                                .status(404)
                                                .send({ message: "No se ha encontrado ningun usuario." });
                                        } else {
                                            res.status(200).send({ avatarName: fileName });
                                            AgregarHistorial(usuariohistoria.id, "Actualizo el avatar del usuario: " + body.id);
                                        }
                                    }
                                }
                            );
                        }
                    }
                }
            }
        });

    } catch (error) {
        console.log("Error: ActualizarAvatar");
        console.log(error);

    }
});

/* Obteber el url del avatar */

app.get('/ObtenerURLAvatar/:avatarName', function (req, res) {

    try {

        const avatarName = req.params.avatarName;
        const filePath = "./uploads/avatar/" + avatarName;

        fs.exists(filePath, exists => {
            if (!exists) {
                res.status(404).send({ message: "El avatar que buscas no existe." });
            } else {
                res.sendFile(path.resolve(filePath));
            }
        });

    } catch (error) {
        console.log("Error: ObtenerUrlAvatar");
        console.log(error);

    }

});

/* Activar usuarios por el Id */
app.put('/ActivarUsuario/:id', [verificaToken, verificarRol], function activateUser(req, res) {

    try {
        const { id } = req.params;
        const { disponible } = req.body;
        let usuariohistoria = req.user;

        Usuario.findByIdAndUpdate({ _id: id }, { disponible }, (err, UsuarioActivado) => {
            if (err) {
                res.status(500).send({ message: "Error del servidor." });
            } else {
                if (!UsuarioActivado) {
                    res.status(404).send({ message: "No se ha encontrado el usuario." });
                } else {
                    if (disponible) {
                        res.status(200).send({ message: "Usuario activado correctamente." });
                        AgregarHistorial(usuariohistoria.id, "Activo el usuario: " + id);
                    } else {
                        res
                            .status(200)
                            .send({ message: "Usuario desactivado correctamente." });
                        AgregarHistorial(usuariohistoria.id, "Desactivo el usuario: " + id);
                    }
                }
            }
        });

    } catch (error) {
        console.log("Error: ActivarUsuarios");
        console.log(error);

    }

});

module.exports = app;
