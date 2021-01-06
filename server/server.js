require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');

//
app.use(bodyParser.urlencoded({ extended: false }));

//
app.use(bodyParser.json());

//configuracion global de rutas
app.use(require('./routes/index'));


//coneccion a mongo
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err, res) => {
    if (err) throw err;

    console.log('Base de datos conectada');
});

//puerto
app.listen(process.env.PORT, () => {
    console.log('escuchando puerto: ', process.env.PORT);
});