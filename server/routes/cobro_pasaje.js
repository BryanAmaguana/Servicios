const express = require('express');
const Cobro = require('../models/Cobro_Pasaje_Modulo');
const { verificaToken, verificarRol } = require('../middlewares/autenticacion');
const app = express();
const moment = require('moment-timezone');
const f = moment().tz("America/Guayaquil").format();


/* Obtener cobro pasaje sin filtrado */
app.get('/ObtenerCobroPasajeTodo/:inicio/:fin', [verificaToken], (req, res) => {
    let desde = req.params.inicio;
    let limite = req.params.fin;

    Cobro.find({ }).skip(Number(desde)).limit(Number(limite)).populate('id_tarjeta').populate('id_bus_cobro').exec((err, cobro) => {
        if (!cobro) {
            return res.status(400).send({ message: "No se encontro ningun cobro." });
        }
        res.json({
            cobro: cobro
        });
    });
});

/* Obtener cobro pasaje filtrado */
app.get('/ObtenerCobroPasaje/:inicio/:fin/:bus', [verificaToken], (req, res) => {
    let inicio = req.params.inicio;
    let fin = req.params.fin;
    let bus = req.params.bus;

    Cobro.find({ id_bus_cobro: bus }).find({ fecha_hora_cobro: { $gte: inicio, $lte: fin } }).populate('id_tarjeta').populate('id_bus_cobro').exec((err, cobro) => {
        if (err) {
            return res.status(400).send({ message: "No se encontro ningun cobro." });
        }
        res.json({
            cobro: cobro
        });
    });
});


/* Agregar un cobro */

app.post('/AgregarCobro', function (req, res) {
    const cobro = new Cobro();
    const { id_tarjeta, id_bus_cobro, valor_pagado } = req.body;
    cobro.id_tarjeta = id_tarjeta;
    cobro.id_bus_cobro = id_bus_cobro;
    cobro.fecha_hora_cobro = f;
    cobro.valor_pagado = valor_pagado;

    cobro.save((err, CobroStored) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (!CobroStored) {
                res.status(404).send(false);
            } else {
                res.status(200).send(true);
            }
        }
    });
});


module.exports = app;