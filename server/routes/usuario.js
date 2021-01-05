const express = require('express');
const Usuario = require('../models/Usuario');


const app = express();

app.get('/usuario', function(req, res) {
    res.json('hola usuario');
});

app.post('/usuario', function(req, res) {
    let body = req.body;
    let usuario = new Usuario({
        nombre_usuario: body.nombre,
        contrasena: body.contrasena,
        cedula_persona: body.cedula,
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

module.exports = app;