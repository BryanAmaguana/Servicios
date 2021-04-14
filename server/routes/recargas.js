const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const Recargas = require('../models/Recargas_Modulo');
const app = express();
const moment = require('moment-timezone');
const f = moment().tz("America/Guayaquil").format();


/* Obtener cobro pasaje filtrado */
app.get('/ObtenerRecarga/:desde/:limite', [verificaToken], (req, res) => {
    const desde = req.params.desde;
    const limite = req.params.limite;
    Recarga.find({}).skip(Number(desde)).limit(Number(limite)).sort({ cedula_persona: 1 }).populate('id_usuario').populate('id_tarjeta_recargada').exec((err, recarga) => {
        if (err) {
            return res.status(400).send({ message: "No se encontro ninguna recarga." });
        }
        res.json({
            recarga: recarga
        });
    });
});

/* Obtener cobro pasaje filtrado */
app.get('/ObtenerRecargas/:inicio/:fin/:id_usuario', [verificaToken], (req, res) => {
    let inicio = req.params.inicio;
    let fin = req.params.fin;
    let id_usuario = req.params.id_usuario;

    Recargas.find({ id_usuario: id_usuario }).find({ fecha_hora_Accion: { $gte: inicio, $lte: fin } }).populate('id_usuario').populate('id_tarjeta_recargada').exec((err, recarga) => {
        if (err) {
            return res.status(400).send({ message: "No se encontro ninguna recarga." });
        }
        res.json({
            recarga: recarga
        });
    });
});


/* Agregar un cobro */

app.post('/AgregarRecarga', function (req, res) {
    const cobro = new Cobro();
    const { valor_recarga, id_tarjeta_recargada, id_usuario } = req.body;
    cobro.id_tarjeta_recargada = id_tarjeta_recargada;
    cobro.valor_recarga = valor_recarga;
    cobro.fecha_hora_Accion = f;
    cobro.id_usuario = id_usuario;

    cobro.save((err, RecargaStored) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (!RecargaStored) {
                res.status(404).send(false);
            } else {
                res.status(200).send(true);
            }
        }
    });
});


module.exports = app;