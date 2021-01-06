const express = require('express');
const Persona = require('../models/persona');


const app = express();

app.get('/persona', function(req, res) {

    Persona.find({}) //aqui se pone los campos que deseo
        //       .skip(5)
        //       .limit(5)
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
        })
});


app.get('/CantidadPersonas', function(req, res) {

    Persona.find({})
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
        })
});



app.post('/persona', function(req, res) {
    let body = req.body;
    let persona = new Persona({
        cedula_persona: body.cedula,
        nombre_persona: body.nombre,
        apellido_persona: body.apellido,
        direccion_persona: body.direccion,
        celular_persona: body.celular,
        fecha_nacimiento_persona: body.fecha_Nacimiento
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
        })
    });

});


//borrar definitivamente
app.delete('/persona/:id', function(req, res) {

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



//cambiar el estado de la persona




module.exports = app;