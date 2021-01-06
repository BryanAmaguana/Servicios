const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');

const { verificaToken, verificarRol } = require('../middlewares/autenticacion');

const app = express();

app.get('/GetUsuario', verificaToken, (req, res) => {
    Usuario.find({}) //aqui se pone los campos que deseo
        //       .skip(5)
        //       .limit(5)
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
        })
});

app.post('/PostUsuario', [verificaToken, verificarRol], function(req, res) {
    let body = req.body;
    let usuario = new Usuario({
        nombre_usuario: body.nombre,
        contrasena: bcrypt.hashSync(body.contrasena, 10),
        cedula_persona: body.cedula,
        correo: body.correo,
        Rol_Usuario: body.Rol_Usuario,
        fecha_registro_usuario: body.fecha,
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
        })
    });
});

app.put('/usuario/:id', [verificaToken, verificarRol], function(req, res) {

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

    })
});


module.exports = app;