const express = require('express');
const { verificaToken, verificarRol } = require('../middlewares/autenticacion');
const Tipo = require('../models/Tipo_pasajero_Modulo');
const app = express();

/* Obtener Tipo_Pasajero activas e inactivas */

app.get('/ObtenerTipo_Pasajero/:disponible', [verificaToken], (req, res) => {
    let disponible = req.params.disponible;
    Tipo.find({ disponible: disponible }).sort({ nombre: 1 }).exec((err, tipo) => {
        if (err) {
            return res.status(400).send({ message: "No se encontro ningun Tipo de pasajero." });
        }
        res.json({
            tipo: tipo
        });
    });
});

/* Agregar un Tipo_Pasajero */

app.post('/AgregarTipo_Pasajero', [verificaToken , verificarRol], function (req, res) {
    const tipo = new Tipo();

    const { nombre,  valor, descripcion } = req.body;
    tipo.nombre = nombre;
    tipo.valor = valor;
    tipo.disponible = true;
    tipo.descripcion = descripcion;

    tipo.save((err, TipoStored) => {
        if (err) {
            res.status(500).send({ message: "El tipo de pasajero ya existe." });
        } else {
            if (!TipoStored) {
                res.status(404).send({ message: "Error al crear el tipo de pasajero." });
            } else {
                res.status(200).send({ message: "Tipo de pasajero creado exitosamente." });
            }
        }
    });
});

/* Activar desactivar un Tipo_Pasajero */

app.put('/ActivarTipo_Pasajero/:id', [verificaToken, verificarRol], function activateUser(req, res) {
    const { id } = req.params;
    const { disponible } = req.body;
  
    Tipo.findByIdAndUpdate({ _id: id }, { disponible }, (err, TipoActivada) => {
      if (err) {
        res.status(500).send({ message: "Error del servidor." });
      } else {
        if (!TipoActivada) {
          res.status(404).send({ message: "No se ha encontrado ningun Tipo de pasajero." });
        } else {
          if (disponible) {
            res.status(200).send({ message: "Tipo de pasajero activado correctamente." });
          } else {
            res
              .status(200)
              .send({ message: "Tipo de pasajero desactivado correctamente." });
          }
        }
      }
    });
});

/* Eliminar un Tipo_Pasajero */

app.delete('/BorrarTipo_Pasajero/:id', [verificaToken, verificarRol], function (req, res) {
    const { id } = req.params;

    Tipo.findByIdAndRemove(id, (err, TipoDeleted) => {
        if (err) {
            res.status(500).send({ message: "Error del servidor." });
        } else {
            if (!TipoDeleted) {
                res.status(404).send({ message: "Tipo de pasajero no encontrada." });
            } else {
                res
                    .status(200)
                    .send({ message: "El Tipo de pasajero ha sido eliminado correctamente." });
            }
        }
    });
});

/* Actualizar Tipo_Pasajero */

app.put('/ActualizarTipo_Pasajero/:id', [verificaToken, verificarRol], function (req, res) {
    let TipoData = req.body;
    const params = req.params;

    Tipo.findByIdAndUpdate({ _id: params.id }, TipoData, (err, TipoUpdate) => {
        if (err) {
            res.status(500).send({ message: "Datos Duplicados." });
        } else {
            if (!TipoUpdate) {
                res
                    .status(404)
                    .send({ message: "No se ha encontrado ningun Tipo de pasajero." });
            } else {
                res.status(200).send({ message: "Tipo de pasajero actualizado correctamente." });
            }
        }
    });
});


module.exports = app;