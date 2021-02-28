const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const Recargas = require('../models/Recargas_Modulo');
const app = express();


/* Obtener todas las recargas */

app.get('/ObtenerHistorialRecargas', verificaToken, function(req, res) {

    Recargas.find({}).exec((err, recargas) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            recargas,
        });
    });
});

/* obtener las recargas por usuario */

app.get('/BuscarRecargaUsuario/:id_usuario', verificaToken, (req, res) => {
    let id_usuario = req.params.id_usuario;

    Recargas.find({ id_usuario: id_usuario }).exec((err, recarga) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!recarga) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Recargas no encontradas'
                }
            });
        }
        res.json({
            ok: true,
            recarga
        });
    });
});

/* Obtener la cantidad de recargas por usuario */

app.get('/BuscarCantidadRecargaUsuario/:id_usuario', verificaToken, (req, res) => {
    let id_usuario = req.params.id_usuario;

    Recargas.find({ id_usuario: id_usuario }).exec((err, recarga) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        Recargas.count({}, (err, conteo) => {
            res.json({
                ok: true,
                cuantos: conteo
            });
        });
    });
});

/* Obtener recargas por trajeta */

app.get('/BuscarRecargaTarjeta/:id_tarjeta_recargada', verificaToken, (req, res) => {
    let id_tarjeta_recargada = req.params.id_tarjeta_recargada;

    Recargas.find({ id_tarjeta_recargada: id_tarjeta_recargada }).exec((err, recarga) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!recarga) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Tarjeta no encontradas'
                }
            });
        }
        res.json({
            ok: true,
            recarga
        });
    });
});

/* Obtener la cantidad de recargas por tarjeta */

app.get('/BuscarCantidadRecargaTarjeta/:id_tarjeta_recargada', verificaToken, (req, res) => {
    let id_tarjeta_recargada = req.params.id_tarjeta_recargada;

    Recargas.find({ id_tarjeta_recargada: id_tarjeta_recargada }).exec((err, recarga) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        Recargas.count({}, (err, conteo) => {
            res.json({
                ok: true,
                cuantos: conteo
            });
        });
    });
});

/* Agregar una recarga */

app.post('/AgregarRecarga', verificaToken, function(req, res) {
    let body = req.body;
    let recarga = new Recargas({
        fecha_hora_Accion: body.fecha_hora,
        accion_recargador: body.accion_recargador,
        valor_recarga: body.valor_recarga,
        id_tarjeta_recargada: body.id_tarjeta_recargada,
        id_usuario: body.id_usuario
    });

    recarga.save((err, RecargaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            recarga: RecargaDB
        });
    });
});

module.exports = app;