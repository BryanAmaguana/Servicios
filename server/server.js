require('./config/config');

const express = require('express');
const app = express();

const bodyParser = require('body-parser');

//
app.use(bodyParser.urlencoded({ extended: false }));

//
app.use(bodyParser.json());

app.get('/persona', function(req, res) {
    res.json('hola usuario');
});

app.post('/persona', function(req, res) {
    let body = req.body;

    if (body.nombre === undefined) {
        req.statusCode(400).json({
            ok: false,
            mensaje: 'el nombre es necesario'
        });

    } else {
        res.json({
            Persona: body
        });
    }


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

app.listen(process.env.PORT, () => {
    console.log('escuchando puerto: ', process.env.PORT);
});