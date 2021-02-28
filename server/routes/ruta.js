const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const Ruta = require('../models/Ruta_Modulo');
const app = express();


/* Obtener todas las rutas */

app.get('/ObtenerRuta', verificaToken, function(req, res) {

    Ruta.find({ disponible: true }).exec((err, ruta) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            ruta,
        });
    });
});

/* Obtener la ruta por el nombre */

app.get('/BuscarRutaNombre/:nombre', verificaToken, (req, res) => {
    let nombre = req.params.nombre;

    Ruta.find({ disponible: true }, { nombre_ruta: nombre }).exec((err, ruta) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!ruta) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Ruta no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            ruta
        });
    });
});


/* Obtener la cantidad de rutas */

app.get('/CantidadRutas', verificaToken, function(req, res) {

    Ruta.find({ disponible: true })
        .exec((err, ruta) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            //aqui va las condiciones para que cuente
            Ruta.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    cuantos: conteo
                });
            });
        });
});

/* Agregar una ruta */

app.post('/AgregarRuta', verificaToken, function(req, res) {
    let body = req.body;
    let ruta = new Ruta({
        nombre_ruta: body.nombre,
        descripcion: body.descripcion,
        disponible: doby.disponible
    });

    ruta.save((err, RutaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            ruta: RutaDB
        });
    });
});

/* Actualizar una ruta */

app.put('ActualizarRuta/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Ruta.findById(id, (res, RutaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!RutaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Id no existe'
                }
            });
        }

        RutaDB.nombre_ruta = body.nombre;
        RutaDB.descripcion = body.descripcion;
        RutaDB.disponible = docy.disponible;

        RutaDB.save((err, RutaActualizada) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                ruta: RutaActualizada
            });
        });
    });
});


/* Eliminar una ruta */

app.delete('BorrarRuta/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Ruta.findById(id, (err, RutaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!RutaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Id no existe'
                }
            });
        }

        RutaDB.disponible = false;

        RutaDB.save((err, RutaBorrada) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                ruta: RutaBorrada,
                message: 'Ruta Borrada'
            });

        });
    });
});


module.exports = app;