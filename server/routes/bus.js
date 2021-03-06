const express = require('express');
const { verificaToken, verificarRol } = require('../middlewares/autenticacion');
const Bus = require('../models/Bus_Modulo');
const { AgregarHistorial } = require('../routes/historial_admin');

const app = express();


/* Listado de buses paginada */

app.get('/ObtenerBus/:disponible/:desde/:limite', [verificaToken], (req, res) => {
    try {
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
    } catch (error) {
        console.log("Error: ObtenerBus")
        console.log(error);
    }
});


/* Agregar un bus */
app.post('/AgregarBus', [verificaToken, verificarRol], function (req, res) {
    try {
        const bus = new Bus();
        let usuario = req.user;
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
                    AgregarHistorial(usuario.id, "Agrego el bus: " + bus.numero_bus);
                }
            }
        });
    } catch (error) {
        console.log("Error: AgregarBus")
        console.log(error);
    }

});


/* Activar/Desactivar Buses por el Id */
app.put('/ActivarBuses/:id', [verificaToken, verificarRol], function activateBus(req, res) {
    try {
        const { id } = req.params;
        const { disponible } = req.body;
        let usuario = req.user;
        Bus.findByIdAndUpdate({ _id: id }, { disponible }, (err, BusActivado) => {
            if (err) {
                res.status(500).send({ message: "Error del servidor." });
            } else {
                if (!BusActivado) {
                    res.status(404).send({ message: "No se ha encontrado ningun Bus." });
                } else {
                    if (disponible) {
                        res.status(200).send({ message: "Bus activado correctamente." });
                        AgregarHistorial(usuario.id, "Activo el bus id: " + id);
                    } else {
                        res.status(200).send({ message: "Bus desactivado correctamente." });
                        AgregarHistorial(usuario.id, "desactivo el bus id: " + id);
                    }
                }
            }
        });
    } catch (error) {
        console.log("Error: ActivarBus");
        console.log(error);
    }


});

/* Eliminar un Bus */

app.delete('/BorrarBus/:id', [verificaToken, verificarRol], function (req, res) {
    try {
        const { id } = req.params;
        let usuario = req.user;
        Bus.findByIdAndRemove(id, (err, BusDeleted) => {
            if (err) {
                res.status(500).send({ message: "Error del servidor." });
            } else {
                if (!BusDeleted) {
                    res.status(404).send({ message: "Bus no encontrado." });
                } else {
                    res.status(200).send({ message: "El Bus ha sido eliminado correctamente." });
                    AgregarHistorial(usuario.id, "Borro el bus: " + id);
                }
            }
        });
    } catch (error) {
        console.log("Error: BorrarBus");
        console.log(error);
    }

});

/* Actualizar Usuario */

app.put('/ActualizarBus/:id', [verificaToken, verificarRol], function (req, res) {
    try {
        let BusData = req.body;
        const params = req.params;
        let usuario = req.user;

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
                    AgregarHistorial(usuario.id, "Actualizo el bus Id: " + params.id);
                }
            }
        });
    } catch (error) {
        console.log("Error: ActualizarBus");
        console.log(error);
    }

});

/* Buscar bus por el numero*/

app.get('/BuscarBusNumero/:numero_bus/:disponible', [verificaToken], (req, res) => {
    try {
        const numero_bus = req.params.numero_bus;
        const disponible = req.params.disponible;
        Bus.find({ numero_bus: numero_bus, disponible: disponible }).populate('id_persona').exec((err, bus) => {
            if (!bus) {
                return res.status(400).send({ message: "No se encontro ningun Bus." });
            }
            res.json({
                bus: bus
            });
        });

    } catch (error) {
        console.log("Error: BusarBusNumero")
        console.log(error);
    }

});

module.exports = app;
