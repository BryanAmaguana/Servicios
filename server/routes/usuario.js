const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const { verificaToken, verificarRol } = require('../middlewares/autenticacion');
const { disable } = require('./login');

const app = express();


/* Obtener todos los usuarios */

app.get('/ObtenerUsuario',[verificaToken], (req, res) => {
    Usuario.find({})
        .exec((err, usuario) => {
            if (err) {
                return res.status(400).send({message: "No se encontro ningun usuario."});
            }
            res.json({
                ok: true,
                usuario,
            });
        });
});


/* Obtener usuario activos */

app.get('/ObtenerUsuarioActivos/:disponible',[verificaToken], (req, res) => {
    let disponible = req.params.disponible

    Usuario.find({ disponible: disponible}).exec((err, usuario) => {
        if (err) {
            return res.status(400).send({message: "No se encontro ningun usuario."});
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
                return res.status(400).send({message: "No se encontro ningun usuario."});
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

    const { nombre, contrasena, correo, id_persona, rol_Usuario, fecha_registro_Usuario, disponible, Rcontrasena } = req.body;
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
        bcrypt.hash(contrasena, saltRounds,  function(err, hash) {
          if (err) {
            res
              .status(500)
              .send({ message: "Error al encriptar cla contraseña." });
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

app.put('/ActualizarUsuario/:id', [verificaToken, verificarRol], function (req, res) {

    let id = req.params.id;
    let body = req.body;


    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
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


module.exports = app;