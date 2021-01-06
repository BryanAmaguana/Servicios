const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');

const app = express();

app.get('/usuario', function(req, res) {
    res.json('hola usuarioU');
});

app.post('/usuario', function(req, res) {
    let body = req.body;
    let usuario = new Usuario({
        nombre_usuario: body.nombre,
        contrasena: bcrypt.hashSync(body.contrasena, 10),
        cedula_persona: body.cedula,
        correo: body.correo,
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

app.put('/usuario/:id', function(req, res) {

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