const express = require('express');
const { verificaToken, verificarRol } = require('../middlewares/autenticacion');
const Ruta = require('../models/Ruta_Modulo');
const app = express();

/* Obtener ruta activas e inactivas */

app.get('/ObtenerRuta/:disponible', [verificaToken], (req, res) => {
    try {
        let disponible = req.params.disponible;
        Ruta.find({ disponible: disponible }).sort({ numero_ruta: 1 }).exec((err, ruta) => {
            if (err) {
                return res.status(400).send({ message: "No se encontro ninguna ruta." });
            }
            res.json({
                ruta: ruta
            });
        });

    } catch (error) {
        console.log("Error: ObtenerRuta");
        console.log(error);

    }

});

/* Agregar una ruta */

app.post('/AgregarRuta', [verificaToken, verificarRol], function (req, res) {

    try {
        const ruta = new Ruta();

        const { numero_ruta, nombre_ruta, descripcion } = req.body;
        ruta.numero_ruta = numero_ruta;
        ruta.nombre_ruta = nombre_ruta;
        ruta.disponible = true;
        ruta.descripcion = descripcion;

        ruta.save((err, RutaStored) => {
            if (err) {
                res.status(500).send({ message: "La ruta ya existe." });
            } else {
                if (!RutaStored) {
                    res.status(404).send({ message: "Error al crear la ruta." });
                } else {
                    res.status(200).send({ message: "Ruta creada exitosamente." });
                }
            }
        });

    } catch (error) {
        console.log("Error: AgregarRuta");
        console.log(error);

    }
});

/* Activar desactivar una Ruta */

app.put('/ActivarRuta/:id', [verificaToken, verificarRol], function activateUser(req, res) {

    try {
        const { id } = req.params;
        const { disponible } = req.body;

        Ruta.findByIdAndUpdate({ _id: id }, { disponible }, (err, RutaActivada) => {
            if (err) {
                res.status(500).send({ message: "Error del servidor." });
            } else {
                if (!RutaActivada) {
                    res.status(404).send({ message: "No se ha encontrado ninguna Ruta." });
                } else {
                    if (disponible) {
                        res.status(200).send({ message: "Ruta activado correctamente." });
                    } else {
                        res
                            .status(200)
                            .send({ message: "Ruta desactivado correctamente." });
                    }
                }
            }
        });

    } catch (error) {
        console.log("Error: ActivarRuta");
        console.log(error);

    }
});

/* Eliminar una Ruta */

app.delete('/BorrarRuta/:id', [verificaToken, verificarRol], function (req, res) {

    try {
        const { id } = req.params;

        Ruta.findByIdAndRemove(id, (err, RutaDeleted) => {
            if (err) {
                res.status(500).send({ message: "Error del servidor." });
            } else {
                if (!RutaDeleted) {
                    res.status(404).send({ message: "Ruta no encontrada." });
                } else {
                    res
                        .status(200)
                        .send({ message: "La Ruta ha sido eliminada correctamente." });
                }
            }
        });

    } catch (error) {
        console.log("Error: BorrarRuta");
        console.log(error);

    }

});

/* Actualizar Ruta */

app.put('/ActualizarRuta/:id', [verificaToken, verificarRol], function (req, res) {

    try {
        let RutaData = req.body;
        const params = req.params;

        Ruta.findByIdAndUpdate({ _id: params.id }, RutaData, (err, RutaUpdate) => {
            if (err) {
                res.status(500).send({ message: "Datos Duplicados." });
            } else {
                if (!RutaUpdate) {
                    res
                        .status(404)
                        .send({ message: "No se ha encontrado ninguna Ruta." });
                } else {
                    res.status(200).send({ message: "Ruta actualizada correctamente." });
                }
            }
        });

    } catch (error) {
        console.log("Error: ActualizarRuta");
        console.log(error);

    }

});

module.exports = app;