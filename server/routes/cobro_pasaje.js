const express = require('express');
const Cobro = require('../models/cobro_pasaje');
const { verificaToken, verificarRol } = require('../middlewares/autenticacion');
const app = express();



/* Obtener todos los cobros */

app.get('/ObtenerCobros', verificaToken, (req, res) => {
    Cobros.find({})
        .exec((err, cobros) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                cobros,
            });
        });
});


/* Agregar un cobro */

app.post('/AgregarCobro', verificaToken, function(req, res) {
    let body = req.body;
    let cobro = new Cobro({
        id_pasajero: body.id_pasajero,
        id_bus_cobro: body.id_bus_cobro,
        fecha_hora_cobro: body.fecha_hora_cobro,
        valor_pagado: body.valor_pagado
    })

    cobro.save((err, cobroDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            cobro: cobroDB
        });
    });
});


module.exports = app;