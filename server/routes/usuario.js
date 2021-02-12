const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const multipart = require('connect-multiparty');
const md_upload_avatar = multipart({ uploadDir: "./uploads/avatar" });
/* /Users/bryanamaguana/Desktop/Servicios/uploads/avatar */
const fs = require("fs");
const path = require("path");


const { verificaToken, verificarRol } = require('../middlewares/autenticacion');
const { disable } = require('./login');

const app = express();


/* Obtener todos los usuarios */

app.get('/ObtenerUsuario', verificaToken, function (req, res) {
    Usuario.find({}).populate('id_persona').populate('id_rol').exec((err, usuario) => {
        if (err) {
            return res.status(400).send({ message: "No se encontro ningun usuario." });
        }
        res.json({
            ok: true,
            usuario,
        });
    });
});

/* Obtener usuario activos */

app.get('/ObtenerUsuarioActivos/:disponible', [verificaToken], (req, res) => {
    let disponible = req.params.disponible

    Usuario.find({ disponible: disponible }).populate('id_persona').populate('id_rol').exec((err, usuario) => {
        if (err) {
            return res.status(400).send({ message: "No se encontro ningun usuario." });
        }
        res.json({
            ok: true,
            usuario
        });
    });

});

/* Obtener cantidad de Usuarios */

app.get('/CantidadUsuarios', verificaToken, function (req, res) {

    Usuario.find({ disponible: true })
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
});

/* Agregar un usuario */

app.post('/AgregarUsuario', function (req, res) {
    const usuario = new Usuario();

    const { nombre, contrasena, correo, id_persona, rol_Usuario, fecha_registro_Usuario, disponible, Rcontrasena, avatar } = req.body;
    usuario.nombre_usuario = nombre;
    usuario.correo = correo;
    usuario.id_persona = id_persona;
    usuario.rol_Usuario = rol_Usuario;
    usuario.fecha_registro_Usuario = fecha_registro_Usuario;
    usuario.disponible = disponible;
    usuario.avatar = avatar;

    if (!contrasena || !Rcontrasena) {
        res.status(404).send({ message: "Las contraseñas son obligatorias." });
    } else {
        if (contrasena !== Rcontrasena) {
            res.status(404).send({ message: "Las contraseñas no son iguales." });
        } else {
            bcrypt.hash(contrasena, saltRounds, function (err, hash) {
                if (err) {
                    res
                        .status(500)
                        .send({ message: "Error al encriptar la contraseña." });
                } else {
                    usuario.contrasena = hash;

                    usuario.save((err, userStored) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send({ message: "El usuario ya existe." });
                        } else {
                            if (!userStored) {
                                res.status(404).send({ message: "Error al crear el usuario." });
                            } else {
                                res.status(200).send({ user: userStored });
                            }
                        }
                    });
                }
            });
        }
    }
});

/* Actualizar Usuario */

app.put('/ActualizarUsuario/:id', [verificaToken], function (req, res) {
        let userData = req.body;
        const params = req.params;
      
        if (userData.contrasena != null) {
           bcrypt.hash(userData.contrasena, saltRounds, (err, hash) => {
            if (err) {
              res.status(500).send({ message: "Error al encriptar la contraseña." });
            } else {
                if (!userData) {
                    res.status(404).send({ message: "No se encontro ningun usuario"});
                } else {
                    userData.contrasena = hash;
                    Usuario.findByIdAndUpdate({ _id: params.id }, userData, (err, userUpdate) => {
                        if (err) {
                          res.status(500).send({ message: "Error del servidor." });
                        } else {
                          if (!userUpdate) {
                            res
                              .status(404)
                              .send({ message: "No se ha encontrado ningun usuario." });
                          } else {
                            res.status(200).send({ message: "Usuario actualizado correctamente." });
                          }
                        }
                      });
                }
            }
          });
        }else{
            Usuario.findByIdAndUpdate({ _id: params.id }, userData, (err, userUpdate) => {
                if (err) {
                  res.status(500).send({ message: "Error del servidor." });
                } else {
                  if (!userUpdate) {
                    res
                      .status(404)
                      .send({ message: "No se ha encontrado ningun usuario." });
                  } else {
                    res.status(200).send({ message: "Usuario actualizado correctamente." });
                  }
                }
              });
        }


      });


/* Eliminar un usuario */

app.delete('/BorrarUsuario/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Usuario.findById(id, (err, UsuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!UsuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Id no existe'
                }
            });
        }

        UsuarioDB.disponible = false;

        UsuarioDB.save((err, UsuarioBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuario: UsuarioBorrado,
                message: 'Usuario Borrado'
            });

        });
    });
});

/* Actualizar el Avatar */

app.put('/ActualizarAvatar/:id', [verificaToken, md_upload_avatar], function (req, res) {
    const body = req.params;
    let now = new Date();
    Usuario.findById({ _id: body.id }, (err, userData) => {
        if (err) {
            res.status(500).send({ message: "Error del servidor." });
        } else {
            if (!userData) {
                res.status(404).send({ message: "Nose ha encontrado ningun usuario." });
            } else {
                let usuario = userData;
                console.log(req.files);

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
                                    }
                                }
                            }
                        );
                    }
                }
            }
        }
    });
});

/* Obteber el url del avatar */

app.get('/ObtenerURLAvatar/:avatarName', function (req, res) {

    const avatarName = req.params.avatarName;
    const filePath = "./uploads/avatar/" + avatarName;

    fs.exists(filePath, exists => {
        if (!exists) {
            res.status(404).send({ message: "El avatar que buscas no existe." });
        } else {
            res.sendFile(path.resolve(filePath));
        }
    });
});


module.exports = app;