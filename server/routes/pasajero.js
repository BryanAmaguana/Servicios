const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const Pasajero = require('../models/Pasajero_Modulo');

const app = express();

/* Listado de pasajeros paginados */

app.get('/ObtenerPasajero/:disponible/:desde/:limite', [verificaToken], (req, res) => {
    let disponible = req.params.disponible;
    const desde = req.params.desde;
    const limite = req.params.limite;
    Pasajero.find({ disponible: disponible }).skip(Number(desde)).limit(Number(limite)).sort({ cedula_persona: 1 }).populate('id_persona').populate('id_tarjeta_pasajero').populate('id_tipo_pasajero').exec((err, pasajero) => {
        if (err) {
            return res.status(400).send({ message: "No se encontro ningun pasajero." });
        }
        res.json({
            pasajero: pasajero
        });
    });
});


/* Agregar un pasajero */
app.post('/AgregarPasajero', [verificaToken], function (req, res) {
    const pasajero = new Pasajero();

    const { id_persona, cedula_persona, id_tarjeta_pasajero, id_tipo_pasajero } = req.body;
    pasajero.id_persona = id_persona;
    pasajero.cedula_persona = cedula_persona;
    pasajero.id_tarjeta_pasajero = id_tarjeta_pasajero;
    pasajero.id_tipo_pasajero = id_tipo_pasajero;
    pasajero.disponible = true;

    pasajero.save((err, PasajeroStored) => {
        if (err) {
            res.status(500).send({ message: "El Pasajero ya existe." });
        } else {
            if (!PasajeroStored) {
                res.status(404).send({ message: "Error al crear el Pasajero." });
            } else {
                res.status(200).send({ message: "Pasajero creado exitosamente." });
            }
        }
    });
});


/* Activar/Desactivar Pasajero por el Id */
app.put('/ActivarPasajero/:id', [verificaToken], function activatePasajero(req, res) {
    const { id } = req.params;
    const { disponible } = req.body;

    Pasajero.findByIdAndUpdate({ _id: id }, { disponible }, (err, PasajeroActivado) => {
        if (err) {
            res.status(500).send({ message: "Error del servidor." });
        } else {
            if (!PasajeroActivado) {
                res.status(404).send({ message: "No se ha encontrado ningun Pasajero." });
            } else {
                if (disponible) {
                    res.status(200).send({ message: "Pasajero activado correctamente." });
                } else {
                    res
                        .status(200)
                        .send({ message: "Pasajero desactivado correctamente." });
                }
            }
        }
    });
});

/* Eliminar un Pasajero */

app.delete('/BorrarPasajero/:id', [verificaToken], function (req, res) {
    const { id } = req.params;

    Pasajero.findByIdAndRemove(id, (err, PasajeroDeleted) => {
        if (err) {
            res.status(500).send({ message: "Error del servidor." });
        } else {
            if (!PasajeroDeleted) {
                res.status(404).send({ message: "Pasajero no encontrado." });
            } else {
                res
                    .status(200)
                    .send({ message: "El Pasajero ha sido eliminado correctamente." });
            }
        }
    });
});

/* Actualizar Pasajero */

app.put('/ActualizarPasajero/:id', [verificaToken], function (req, res) {
    let PasajeroData = req.body;
    const params = req.params;

    Pasajero.findByIdAndUpdate({ _id: params.id }, PasajeroData, (err, PasajeroUpdate) => {
        if (err) {
            res.status(500).send({ message: "Datos Duplicados." });
        } else {
            if (!PasajeroUpdate) {
                res
                    .status(404)
                    .send({ message: "No se ha encontrado ningun Pasajero." });
            } else {
                res.status(200).send({ message: "Pasajero actualizado correctamente." });
            }
        }
    });
});

/* Buscar Pasajero por la cedula*/

app.get('/BuscarPasajeroCedula/:cedula_persona/:disponible', [verificaToken], (req, res) => {
    const cedula_persona = req.params.cedula_persona;
    const disponible = req.params.disponible;
    Pasajero.find({ cedula_persona: { '$regex': `${cedula_persona}`, '$options': 'i' } }).find({disponible: disponible}).populate('id_persona').populate('id_tarjeta_pasajero').populate('id_tipo_pasajero').exec((err, pasajero) => {
        if (err) {
            return res.status(400).send({ message: "No se encontro ningun pasajero." });
        }
        res.json({
            pasajero: pasajero
        });
    });
});


module.exports = app;