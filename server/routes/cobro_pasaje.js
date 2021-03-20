const express = require('express');
const Cobro = require('../models/Cobro_Pasaje_Modulo');
const { verificaToken, verificarRol } = require('../middlewares/autenticacion');
const app = express();


/* Obtener cobro pasaje sin filtrado */
app.get('/ObtenerCobroPasajeTodo', [verificaToken], (req, res) => {
    Cobro.find({ }).populate('id_pasajero').populate('id_bus_cobro').exec((err, cobro) => {
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

    Cobro.find({ id_bus_cobro: bus }).find({ fecha_hora_cobro: { $gte: inicio, $lte: fin } }).populate('id_pasajero').populate('id_bus_cobro').exec((err, cobro) => {
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

    const { id_pasajero, id_bus_cobro, fecha_hora_cobro, valor_pagado } = req.body;
    cobro.id_pasajero = id_pasajero;
    cobro.id_bus_cobro = id_bus_cobro;
    cobro.fecha_hora_cobro = fecha_hora_cobro;
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