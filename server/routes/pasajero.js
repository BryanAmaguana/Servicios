const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const Pasajero = require('../models/Pasajero_Modulo');

const app = express();


/* Obtener lista de pasajeros */

app.get('/ObtenerPasajero', verificaToken, (req, res) => {
    Pasajero.find({})
        .exec((err, pasajero) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                pasajero,
            });
        });
});


/* Obtener pasajero por la cedula */

app.get('/BuscarPasajeroCedula/:cedula', verificaToken, (req, res) => {
    let cedula = req.params.cedula;

    Pasajero.find({ cedula_pasajero: cedula }).exec((err, pasajero) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            pasajero
        });
    });

});


/* obtener numero de pasajeros totales */

app.get('/CantidadPasajeros', verificaToken, function(req, res) {

    Pasajero.find({ disponible: true })
        .exec((err, pasajero) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            //aqui va las condiciones para que cuente
            Pasajero.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    cuantos: conteo
                });
            });
        });
});


/* Agregar un pasajero */


app.post('/AgregarPasajero', verificaToken, function(req, res) {
    let body = req.body;
    let pasajero = new Pasajero({
        cedula_pasajero: body.cedula_pasajero,
        id_tarjeta_pasajero: body.id_tarjeta_pasajero,
        valor_pasaje_pasajero: body.valor_pasaje_pasajero,
        tipo_pasaje_pasajero: body.tipo_pasaje_pasajero,
        disponible: body.disponible
    });

    pasajero.save((err, pasajeroDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            pasajero: pasajeroDB
        });
    });
});


/* Actuaizar un pasajero */

app.put('ActualizarPasajero/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Pasajero.findById(id, (err, PasajeroDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!PasajeroDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Id no existe'
                }
            });
        }
        PasajeroDB.cedula_pasajero = body.cedula_pasajero;
        PasajeroDB.id_tarjeta_pasajero = body.id_tarjeta_pasajero;
        PasajeroDB.valor_pasaje_pasajero = body.valor_pasaje_pasajero;
        PasajeroDB.tipo_pasaje_pasajero = body.tipo_pasaje_pasajero;
        PasajeroDB.disponible = body.disponible;

        PasajeroDB.save((err, PasajeroActualizado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                pasajero: PasajeroActualizado
            });
        });
    });
});


/* Eliminar un pasajero */

app.delete('/BorrarPasajero/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Usuario.findById(id, (err, PasajeroDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!PasajeroDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Id no existe'
                }
            });
        }

        PasajeroDB.disponible = false;

        PasajeroDB.save((err, PasajeroBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                pasajero: PasajeroBorrado,
                message: 'Pasajero Borrado'
            });

        });
    });
});



module.exports = app;