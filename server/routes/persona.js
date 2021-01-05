const express = require('express');
const Persona = require('../models/persona');


const app = express();

app.get('/persona', function(req, res) {
    res.json('hola usuario');
});

app.post('/persona', function(req, res) {
    let body = req.body;
    let persona = new Persona({
        nom_per: body.nombre,
        ape_per: body.apellido,
        dir_per: body.direccion,
        cel_per: body.celular,
        fec_nac_per: body.fecha_Nacimiento
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

app.put('/persona/:id', function(req, res) {
    let id = req.params.id;
    res.json('put usuario');

    res.json({
        id
    });
});

app.delete('/persona', function(req, res) {
    res.json('delete usuario');
});

module.exports = app;