const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const Tarjeta = require('../models/Tarjeta_Modulo');
const app = express();

/* Obtener tarjetas Activas y desactivadas */

app.get('/ObtenerTarjeta/:disponible/:desde/:limite', [verificaToken], (req, res) => {
    let disponible = req.params.disponible;
    const desde = req.params.desde;
    const limite = req.params.limite;
    Tarjeta.find({ disponible: disponible }).skip(Number(desde)).limit(Number(limite)).sort({ codigo: 1 }).exec((err, tarjeta) => {
        if (err) {
            return res.status(400).send({ message: "No se encontro ninguna tarjeta." });
        }
        res.json({
            tarjeta: tarjeta
        });
    });
});

/* Agregar una tarjeta */

app.post('/AgregarTarjeta', [verificaToken], function (req, res) {
    const tarjeta = new Tarjeta();

    const { codigo, valor_tarjeta, descripcion } = req.body;
    tarjeta.codigo = codigo;
    tarjeta.valor_tarjeta = valor_tarjeta;
    tarjeta.disponible = true;
    tarjeta.descripcion = descripcion;

    tarjeta.save((err, TarjetaStored) => {
        if (err) {
            res.status(500).send({ message: "La tarjeta ya existe." });
        } else {
            if (!TarjetaStored) {
                res.status(404).send({ message: "Error al crear la tarjeta." });
            } else {
                res.status(200).send({ message: "Tarjeta creada exitosamente." });
            }
        }
    });
});

/* Activar desactivar una tarjeta */

app.put('/ActivarTarjeta/:id', [verificaToken], function activateTarjeta(req, res) {
    const { id } = req.params;
    const { disponible } = req.body;

    Tarjeta.findByIdAndUpdate({ _id: id }, { disponible: disponible }, (err, TarjetaActivado) => {
        if (err) {
            res.status(500).send({ message: "Error del servidor." });
        } else {
            if (!TarjetaActivado) {
                res.status(404).send({ message: "No se ha encontrado ninguna Tarjeta." });
            } else {
                if (disponible) {
                    res.status(200).send({ message: "Tarjeta activada correctamente." });
                } else {
                    res
                        .status(200)
                        .send({ message: "Tarjeta desactivada correctamente." });
                }
            }
        }
    });
});


/* Eliminar una Tarjeta */

app.delete('/BorrarTarjeta/:id', [verificaToken], function (req, res) {
    const { id } = req.params;

    Tarjeta.findByIdAndRemove(id, (err, TarjetaDeleted) => {
        if (err) {
            res.status(500).send({ message: "Error del servidor." });
        } else {
            if (!TarjetaDeleted) {
                res.status(404).send({ message: "Tarjeta no encontrada." });
            } else {
                res
                    .status(200)
                    .send({ message: "La tarjeta ha sido eliminada correctamente." });
            }
        }
    });
});

/* Actualizar Tarjeta */

app.put('/ActualizarTarjeta/:id', [verificaToken], function (req, res) {
    let TarjetaData = req.body;
    const params = req.params;

    Tarjeta.findByIdAndUpdate({ _id: params.id }, TarjetaData, (err, TarjetaUpdate) => {
        if (err) {
            res.status(500).send({ message: "Datos Duplicados." });
        } else {
            if (!TarjetaUpdate) {
                res
                    .status(404)
                    .send({ message: "No se ha encontrado ninguna Tarjeta." });
            } else {
                res.status(200).send({ message: "Tarjeta actualizada correctamente." });
            }
        }
    });
});

/* Buscar Tarjeta por el codigo */

app.get('/ObtenerTarjetaCodigo/:codigo/:disponible', [verificaToken], (req, res) => {
    let codigo = req.params.codigo;
    const disponible = req.params.disponible;
    Tarjeta.find({ codigo: {'$regex': `${codigo}` , '$options': 'i'} }).find({disponible: disponible}).exec((err, tarjeta) => {
        if (err) {
            return res.status(400).send({ message: "No se encontro ninguna tarjeta." });
        }
        res.json({
            tarjeta: tarjeta
        });
    });
});

app.get('/ObtenerTarjetaCodigoP/:codigo', [verificaToken], (req, res) => {
    let codigo = req.params.codigo;
    Tarjeta.findOne({disponible: true, codigo: codigo}).then(tarjeta => {
        if (!tarjeta) {
            res.status(404).send({ message: "No se ha encontrado ninguna tarjeta." });
        } else {
            res.status(200).send({ tarjeta: tarjeta });
        }
    });
});


module.exports = app;