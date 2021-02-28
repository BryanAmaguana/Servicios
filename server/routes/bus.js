const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const Bus = require('../models/Bus_Modulo');

const app = express();


/* Listado de buses */

app.get('/ObtenerListadoBus', verificaToken, function(req, res) {

    Bus.find({ disponible: true }).populate('id_persona').exec((err, bus) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err:{
                        message: 'No hay buses'
                    }
                });
            }
            res.json({
                ok: true,
                bus,
            });
        });
});


/* Listado de buses por numero */

app.get('/BuscarBusNumero/:numero_bus', verificaToken, (req, res) => {

    let numero_bus = req.params.numero_bus;

    Bus.find({ disponible: true }, { numero_bus: numero_bus }).populate('id_persona').exec((err, bus) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!bus) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Numero de bus no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            bus
        });
    });
});



/* Insertar Buses */

app.post('/InsertarBus', verificaToken, function(req, res) {
    let body = req.body;
    let bus = new Bus({
        numero_bus: body.numero_bus,
        id_persona: body.id_persona,
        placa_bus: body.placa_bus,
        disponible: body.disponible
    })

    bus.save((err, busDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            bus: busDB
        });
    });

});


/* Actualizar bus */

app.put('/ActualizarBus/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Bus.findById(id, (err, busDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!busDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Id no existe'
                }
            });
        }

        busDB.numero_bus = body.numero;
        busDB.id_dueno_bus = body.id_dueno;
        busDB.placa_bus = body.placa;
        busDB.disponible = true;

        busDB.save((err, BusGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                bus: BusGuardado
            });
        });
    });
});



/* Eliminar un bus */

app.delete('/BorrarBus/:id', (req, res) => {

    let id = req.params.id;

    Bus.findById(id, (err, busDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!busDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Id no existe'
                }
            });
        }

        busDB.disponible = false;

        busDB.save((err, BusBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                bus: BusBorrado,
                message: 'Bus Borrado'

            });
        });
    });
});

module.exports = app;