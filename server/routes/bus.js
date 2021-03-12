const express = require('express');
const { verificaToken, verificarRol } = require('../middlewares/autenticacion');
const Bus = require('../models/Bus_Modulo');

const app = express();


/* Listado de buses paginada */

app.get('/ObtenerBus/:disponible/:desde/:limite', [verificaToken], (req, res) => {
    let disponible = req.params.disponible;
    const desde = req.params.desde;
    const limite = req.params.limite;
    Bus.find({ disponible: disponible }).skip(Number(desde)).limit(Number(limite)).sort({ numero_bus: 1 }).populate('id_persona').exec((err, bus) => {
        if (err) {
            return res.status(400).send({ message: "No se encontro ningun bus." });
        }
        res.json({
            bus: bus
        });
    });
});


/* Agregar un bus */
app.post('/AgregarBus', [verificaToken, verificarRol], function (req, res) {
    const bus = new Bus();

    const { numero_bus, id_persona, placa_bus } = req.body;
    bus.numero_bus = numero_bus;
    bus.id_persona = id_persona;
    bus.placa_bus = placa_bus;
    bus.disponible = true;

    bus.save((err, BusStored) => {
        if (err) {
            res.status(500).send({ message: "El Bus ya existe." });
        } else {
            if (!BusStored) {
                res.status(404).send({ message: "Error al crear el Bus." });
            } else {
                res.status(200).send({ message: "Bus creado exitosamente." });
            }
        }
    });
});


/* Activar/Desactivar Buses por el Id */
app.put('/ActivarBuses/:id', [verificaToken], function activateBus(req, res) {
    const { id } = req.params;
    const { disponible } = req.body;

    Bus.findByIdAndUpdate({ _id: id }, { disponible }, (err, BusActivado) => {
        if (err) {
            res.status(500).send({ message: "Error del servidor." });
        } else {
            if (!BusActivado) {
                res.status(404).send({ message: "No se ha encontrado ningun Bus." });
            } else {
                if (disponible) {
                    res.status(200).send({ message: "Bus activado correctamente." });
                } else {
                    res
                        .status(200)
                        .send({ message: "Bus desactivado correctamente." });
                }
            }
        }
    });
});

/* Eliminar un Bus */

app.delete('/BorrarBus/:id', [verificaToken, verificarRol], function (req, res) {
    const { id } = req.params;

    Bus.findByIdAndRemove(id, (err, BusDeleted) => {
        if (err) {
            res.status(500).send({ message: "Error del servidor." });
        } else {
            if (!BusDeleted) {
                res.status(404).send({ message: "Bus no encontrado." });
            } else {
                res
                    .status(200)
                    .send({ message: "El Bus ha sido eliminado correctamente." });
            }
        }
    });
});

/* Actualizar Usuario */

app.put('/ActualizarBus/:id', [verificaToken, verificarRol], function (req, res) {
    let BusData = req.body;
    const params = req.params;

    Bus.findByIdAndUpdate({ _id: params.id }, BusData, (err, busUpdate) => {
        if (err) {
            res.status(500).send({ message: "Datos Duplicados." });
        } else {
            if (!busUpdate) {
                res
                    .status(404)
                    .send({ message: "No se ha encontrado ningun Bus." });
            } else {
                res.status(200).send({ message: "Bus actualizado correctamente." });
            }
        }
    });
});

/* Buscar bus por el numero*/

app.get('/BuscarBusNumero/:numero_bus/:disponible', [verificaToken], (req, res) => {
    const numero_bus = req.params.numero_bus;
    const disponible = req.params.disponible;
    Bus.find({numero_bus: numero_bus, disponible: disponible}).populate('id_persona').exec((err, bus) => {
        if (err) {
            return res.status(400).send({ message: "No se encontro ningun Bus." });
        }
        res.json({
            bus: bus
        });
    });
    
});

module.exports = app;