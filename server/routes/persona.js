const express = require('express');
const Persona = require('../models/Persona_Modulo');
const { verificaToken } = require('../middlewares/autenticacion');
const app = express();

/* Obtener Listado todas las personas paginadas */

app.get('/ObtenerPersonas/:desde/:limite', [verificaToken], (req, res) => {
    const desde = req.params.desde;
    const limite = req.params.limite;
    Persona.find().skip(Number(desde)).limit(Number(limite)).sort({ apellido_persona: 1 }).exec((err, persona) => {
        if (err) {
            return res.status(400).send({ message: "No se encontro ninguna persona." });
        }
        res.json({
            persona: persona
        });
    });
});

/* Agregar nueva persona */

app.post('/AgregarPersona', [verificaToken], function (req, res) {
    const persona = new Persona();

    const { cedula_persona, nombre_persona, apellido_persona, direccion_persona, celular_persona, fecha_nacimiento_persona } = req.body;
    persona.cedula_persona = cedula_persona;
    persona.nombre_persona = nombre_persona;
    persona.apellido_persona = apellido_persona;
    persona.direccion_persona = direccion_persona;
    persona.celular_persona = celular_persona;
    persona.fecha_nacimiento_persona = fecha_nacimiento_persona;

    persona.save((err, personaStored) => {
        if (err) {
            res.status(500).send({ message: "Numero de cédula ya registrado." });
        } else {
            if (!personaStored) {
                res.status(404).send({ message: "Error al crear el usuario." });
            } else {
                res.status(200).send({ message: "Persona creada exitosamente." });
            }
        }
    });
});

/* Obtener una persona por la cedula */

app.get('/ObtenerCedulaPersona/:cedula', [verificaToken], (req, res) => {
    let cedula = req.params.cedula;
    Persona.findOne({ cedula_persona: cedula }).then(persona => {
        if (!persona) {
            res.status(404).send({ message: "No se ha encontrado ninguna persona." });
        } else {
            res.status(200).send({ persona: persona });
        }
    });

});

/* Obtener una persona por id */

app.get('/BuscarPersonaId/:id', [verificaToken], (req, res) => {
    let id = req.params.id;
    Persona.find({ _id: id }).exec((err, persona) => {
        if (err) {
            res.status(500).send({ message: "Persona no encontrada." });
        } else {
            res.json({
                persona
            });
        }
    });
});

/* Buscar persona por la cedula*/

app.get('/BuscarPersonaCedula/:cedula_persona', [verificaToken], (req, res) => {
    let cedula_persona = req.params.cedula_persona;
    Persona.find({ cedula_persona: { '$regex': `${cedula_persona}`, '$options': 'i' } }).exec((err, persona) => {
        if (err) {
            return res.status(400).send({ message: "No se encontro ningun usuario." });
        }
        res.json({
            persona: persona
        });
    });
});

/* Actualizar Usuario */

app.put('/ActualizarPersona/:id', [verificaToken], function (req, res) {
    let personaData = req.body;
    const params = req.params;

    Persona.findByIdAndUpdate({ _id: params.id }, personaData, (err, personaUpdate) => {
        if (err) {
            res.status(500).send({ message: "Datos Duplicados." });
        } else {
            if (!personaUpdate) {
                res
                    .status(404)
                    .send({ message: "No se ha encontrado ninguna persona." });
            } else {
                res.status(200).send({ message: "Persona actualizada correctamente." });
            }
        }
    });
});


/* Eliminar un usuario */

app.delete('/BorrarPersona/:id', [verificaToken], function (req, res) {
    const { id } = req.params;
  
    Persona.findByIdAndRemove(id, (err, personaDeleted) => {
      if (err) {
        res.status(500).send({ message: "Error del servidor." });
      } else {
        if (!personaDeleted) {
          res.status(404).send({ message: "Persona no encontrada." });
        } else {
          res
            .status(200)
            .send({ message: "La persona ha sido eliminada correctamente." });
        }
      }
    });
});

module.exports = app;