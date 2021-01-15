const express = require('express');
const Persona = require('../models/persona');
const { verificaToken } = require('../middlewares/autenticacion');
const app = express();

/* Obtener Listado todas las personas */

app.get('/ObtenerPersona', verificaToken, function(req, res) {

    Persona.find({ disponible: true })
        .exec((err, persona) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                persona,
            });
        });
});


/* Obtener la cantidad de personas registradas */

app.get('/CantidadPersonas', verificaToken, function(req, res) {

    Persona.find({ disponible: true })
        .exec((err, persona) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            //aqui va las condiciones para que cuente
            Persona.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    cuantos: conteo
                });
            });
        });
});

/* Obtener una persona por la cedula */

app.get('/BuscarPersonaCedula/:cedula', verificaToken, (req, res) => {
    let cedula = req.params.cedula;

    Persona.find({ cedula_persona: cedula }).exec((err, persona) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            persona
        });
    });

});


/* Agregar una persona */

app.post('/AgregarPersona', verificaToken, function(req, res) {
    let body = req.body;
    let persona = new Persona({
        cedula_persona: body.cedula,
        nombre_persona: body.nombre,
        apellido_persona: body.apellido,
        direccion_persona: body.direccion,
        celular_persona: body.celular,
        fecha_nacimiento_persona: body.fecha_Nacimiento,
        disponible: body.disponible
    })

    persona.save((err, personaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            persona: personaDB
        });
    });

});


/* Actualizar una persona */

app.put('ActualizarPersona/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Persona.findById(id, (err, personaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!personaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Id no existe'
                }
            });
        }

        personaDB.cedula_persona = body.cedula;
        personaDB.nombre_persona = body.nombre;
        personaDB.apellido_persona = body.apellido;
        personaDB.direccion_persona = body.direccion;
        personaDB.celular_persona = body.celular;
        personaDB.fecha_nacimiento_persona = body.fecha_Nacimiento;
        personaDB.disponible = body.disponible;

        personaDB.save((err, personaActualizada) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                persona: personaActualizada
            });
        });
    });

});


/* Borrar una persona */

app.delete('/BorrarPersona/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    Persona.findById(id, (err, PersonaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!PersonaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Id no existe'
                }
            });
        }

        PersonaDB.disponible = false;

        PersonaDB.save((err, PersonaBorrada) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                persona: PersonaDB,
                message: 'Persona Borrada'
            });

        });
    });
});


//borrar definitivamente
app.delete('/BorrarDefinitivamentePersona/:id', verificaToken, function(req, res) {

    let id = req.params.id;

    Persona.findByIdAndRemove(id, (err, personaBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!personaBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            persona: usuarioBorrado
        });
    });
});

module.exports = app;