const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const Recargas = require('../models/Recargas_Modulo');
const app = express();
const moment = require('moment-timezone');
const f = moment().tz("America/Guayaquil").format();
const Tarjeta = require('../models/Tarjeta_Modulo');

app.get('/Recarga',  (req, res) => {
    Recargas.find({}).exec((err, recarga) => {
        if (err) {
            return res.status(400).send({ message: "No se encontro ninguna recarga." });
        }
        res.json({
            recarga: recarga
        });
    });
});

/* Obtener cobro pasaje filtrado */
app.get('/ObtenerRecarga/:desde/:limite', [verificaToken],  (req, res) => {
    const desde = req.params.desde;
    const limite = req.params.limite;
    Recargas.find({}).skip(Number(desde)).limit(Number(limite)).sort({ fecha_hora_Accion: 1 }).exec((err, recarga) => {
        if (err) {
            return res.status(400).send({ message: "No se encontro ninguna recarga." });
        }
        res.json({
            recarga: recarga
        });
    });
});

/* Obtener cobro pasaje filtrado */
app.get('/ObtenerRecargaFiltrado/:inicio/:fin/:nombre_usuario', [verificaToken], (req, res) => {
    let inicio = req.params.inicio;
    let fin = req.params.fin;
    let nombre_usuario = req.params.nombre_usuario;

    Recargas.find({ nombre_usuario: nombre_usuario }).find({ fecha_hora_Accion: { $gte: inicio+'T00:00:00.000+00:00', $lte: fin+'T23:59:59.000+00:00' } }).exec((err, recarga) => {
        if (err) {
            return res.status(400).send({ message: "No se encontro ninguna recarga." });
        }
        res.json({
            recarga: recarga
        });
    });
});


/* Actualizar Tarjeta */

function ActualizarTarjeta(codigo_tarjeta, valor_Total_recarga, valor_recarga, usuario) {
    Tarjeta.updateOne({ codigo: codigo_tarjeta }, { valor_tarjeta: valor_Total_recarga }, (err, TarjetaActivado) => {
        if (err) {
            return "No se encontro tarjeta"
        } else {
            if (!TarjetaActivado) {
            } else {
                AddRecarga(codigo_tarjeta,valor_recarga, usuario);
                return false;
            }
        }
    });
}

function AddRecarga(codigo_tarjeta, valor_recarga, nombre_usuario) {
    const recargas = new Recargas();
    recargas.fecha_hora_Accion = f;
    recargas.valor_recarga = valor_recarga;
    recargas.codigo_tarjeta = codigo_tarjeta;
    recargas.nombre_usuario = nombre_usuario;
    recargas.save((err, RecargaStored) => {
        if (err) {
            return false
        } else {
            if (!RecargaStored) {
                return false
            }
        }
    });
}

/* Agregar una recarga */

app.get('/AgregarRecarga/:valor_recarga/:codigo_tarjeta/:nombre_usuario', function (req, res) {

    const valor_recarga = req.params.valor_recarga;
    const codigo_tarjeta = req.params.codigo_tarjeta;
    const nombre_usuario = req.params.nombre_usuario;


    Tarjeta.find({ codigo: codigo_tarjeta }).exec((err, tarjeta) => {
        if (err) {
            res.json({
                mesanje: "Tarjeta no existe"
            });
        } else {
            try {
                let Nvalor = 0;
                Nvalor = parseFloat(tarjeta[0].valor_tarjeta) + parseFloat(valor_recarga);
                ActualizarTarjeta(codigo_tarjeta, Nvalor.toFixed(2), valor_recarga, nombre_usuario);
                res.json({
                    mesanje: "Recarga exitosa"
                });
            } catch (error) {
                res.json({
                    mesanje: "Tarjeta no existe"
                });
            }
        }
    });
});


module.exports = app;