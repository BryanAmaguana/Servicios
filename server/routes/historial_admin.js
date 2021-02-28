const express = require('express');
const Historial_admin = require('../models/Modulohistorial_admin');
const app = express();


/* Obtener todo el historial */

app.get('/ObtenerHistorial', function(req, res) {

    Historial_admin.find({}).exec((err, historial) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            historial,
        });
    });
});

/* Agregar historial */

app.post('/AgregarHistorial', function(req, res) {
    let body = req.body;
    let historial = new Historial_admin({
        fecha_accion: body.fecha,
        accion_admin: body.accion,
        descripcion: body.descripcion,
        id_usuario: body.id_usuario
    });

    historial.save((err, HistorialDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            historial: HistorialDB
        });
    });
});

module.exports = app;