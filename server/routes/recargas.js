const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const Recargas = require('../models/Recargas_Modulo');
const app = express();
const moment = require('moment-timezone');
const f = moment().tz("America/Guayaquil").format();
const Tarjeta = require('../models/Tarjeta_Modulo');


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

app.post('/AgregarRecarga', function (req, res) {
    const { valor_recarga, codigo_tarjeta, nombre_usuario } = req.body;


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