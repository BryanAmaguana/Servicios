const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');

const { verificaToken, verificarRol } = require('../middlewares/autenticacion');

const app = express();


/* Obtener todos los usuarios */

app.get('/ObtenerUsuario', verificaToken, (req, res) => {
    Usuario.find({})
        .exec((err, usuario) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                usuario,
            });
        });
});

/* Obtener cantidad de Usuarios */

app.get('/CantidadUsuarios', verificaToken, function(req, res) {

    Usuario.find({ disponible: true })
        .exec((err, usuario) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
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

app.post('/AgregarUsuario', [verificaToken, verificarRol], function(req, res) {
    let body = req.body;
    let usuario = new Usuario({
        nombre_usuario: body.nombre,
        contrasena: bcrypt.hashSync(body.contrasena, 10),
        cedula_persona: body.cedula,
        correo: body.correo,
        Rol_Usuario: body.Rol_Usuario,
        fecha_registro_usuario: body.fecha,
        disponible: body.disponible
    })

    usuario.save((err, usuarioDB) => {

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

/* Actualizar Usuario */

app.put('/ActualizarUsuario/:id', [verificaToken, verificarRol], function(req, res) {

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