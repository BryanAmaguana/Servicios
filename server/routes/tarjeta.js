const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const Tarjeta = require('../models/Modulotarjeta');
const app = express();


/* Listar todas las tarjetas */

app.get('/ObtenerTarjetas', verificaToken, function(req, res) {

    Tarjeta.find({ disponible: true }).exec((err, tarjeta) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            tarjeta,
        });
    });
});


/* Listado de tarjeta por codigo */

app.get('/BuscarTarjetaCodigo/:codigo', verificaToken, (req, res) => {
    let codigo = req.params.codigo;

    Tarjeta.find({ disponible: true }, { codigo: codigo }).exec((err, tarjeta) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!tarjeta) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Tarjeta no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            tarjeta
        });
    });
});

/* Obtener la cantidad de tarjetas registradas */

app.get('/CantidadTarjetas', verificaToken, function(req, res) {

    Tarjeta.find({ disponible: true })
        .exec((err, tarjeta) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            //aqui va las condiciones para que cuente
            Tarjeta.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    cuantos: conteo
                });
            });
        });
});

/* Agregar una nueva tarjeta */

app.post('/AgregarTarjeta', verificaToken, function(req, res) {
    let body = req.body;
    let tarjeta = new Tarjeta({
        codigo: body.codigo,
        valor_tarjeta: body.valor_tarjeta,
        tipo: body.tipo,
        disponible: body.disponible,
        descripcion: body.descripcion
    })

    tarjeta.save((err, TarjetaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            tarjeta: TarjetaDB
        });
    });
});



/* Actualizar una tarjeta */

app.put('ActualizarTarjeta/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Tarjeta.findById(id, (err, tarjetaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!tarjetaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Id no existe'
                }
            });
        }
        tarjetaDB.codigo = body.codigo;
        tarjetaDB.valor_tarjeta = body.valor_tarjeta;
        tarjetaDB.tipo = body.tipo;
        tarjetaDB.disponible = body.disponible;
        tarjetaDB.descripcion = body.descripcion;

        tarjetaDB.save((err, tarjetaActualizada) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                tarjeta: tarjetaActualizada
            });
        });
    });
});


/* Eliminar una tarjeta */

app.delete('/BorrarTarjeta/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Tarjeta.findById(id, (err, TarjetaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!TarjetaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Id no existe'
                }
            });
        }

        TarjetaDB.disponible = false;

        TarjetaDB.save((err, TarjetaBorrada) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                tarjeta: TarjetaBorrada,
                message: 'Tarjeta Borrada'
            });

        });
    });
});

module.exports = app;