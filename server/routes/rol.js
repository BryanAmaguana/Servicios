const express = require('express');
const Rol = require('../models/rol');

const app = express();

app.post('/AddRol', function(req, res) {
    let body = req.body;
    let rol = new Rol({
        nombre: body.nombre,
        descripcion: body.descripcion
    })
    rol.save((err, rolDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            rol: rolDB
        })
    });

});

module.exports = app;