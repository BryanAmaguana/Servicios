const express = require('express');
const Tipo = require('../models/Tipo_pasajero_Modulo');


const { verificaToken, verificarRol } = require('../middlewares/autenticacion');

const app = express();


/* Obtener todos los tipos */

app.get('/ObtenerTipos', verificaToken, (req, res) => {
    Tipo.find({})
        .exec((err, tipo) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                tipo,
            });
        });
});

/* Obtener cantidad de tipos */

app.get('/CantidadTipo', verificaToken, function(req, res) {

    Tipo.find({ disponible: true })
        .exec((err, tipo) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            //aqui va las condiciones para que cuente
            Tipo.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    cuantos: conteo
                });
            });
        });
});

/* Agregar tipo */

app.post('/AgregarTipo', [verificaToken, verificarRol], function(req, res) {
    let body = req.body;
    let tipo = new Tipo({
        nombre: body.nombre,
        valor: body.valor,
        descripcion: bady.valor,
        disponible: valor.descripcion
    })

    tipo.save((err, tipoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            tipo: tipoDB
        });
    });
});


/* Actualizar tipo */

app.put('ActualizarTipo/:id', [verificaToken, verificarRol], function(req, res) {
    let id = req.params.id;
    let body = req.body;

    Tipo.findById(id, (err, tipoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!tipoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Id no existe'
                }
            });
        }
        tipoDB.nombre = body.nombre;
        tipoDB.valor = body.valor;
        tipoDB.descripcion = body.descripcion;
        tipoDB.disponible = body.disponible;

        tipoDB.save((err, tipoActualizada) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                tipo: tipoActualizada
            });
        });
    });
});


/* Eliminar tipo */

app.delete('/BorrarTipo/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Tipo.findById(id, (err, TipoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!TipoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Id no existe'
                }
            });
        }

        TipoDB.disponible = false;

        TipoDB.save((err, TipoBorrada) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                tipo: TipoBorrada,
                message: 'Tipo de pasajero Borrado'
            });

        });
    });
});



module.exports = app;