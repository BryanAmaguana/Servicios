const express = require('express');
const Cobro = require('../models/Cobro_Pasaje_Modulo');
const { verificaToken, verificarRol } = require('../middlewares/autenticacion');
const app = express();
const Tarjeta = require('../models/Tarjeta_Modulo');
const moment = require('moment-timezone');
const f = moment().tz("America/Guayaquil").format();


/* Obtener cobro pasaje sin filtrado */
app.get('/ObtenerCobroPasajeTodo/:inicio/:fin', [verificaToken], (req, res) => {
    let desde = req.params.inicio;
    let limite = req.params.fin;

    Cobro.find({}).skip(Number(desde)).limit(Number(limite)).populate('id_tarjeta').populate('id_bus_cobro').exec((err, cobro) => {
        if (!cobro) {
            return res.status(400).send({ message: "No se encontro ningun cobro." });
        }
        res.json({
            cobro: cobro
        });
    });
});

/* Obtener cobro pasaje filtrado */
app.get('/ObtenerCobroPasaje/:inicio/:fin/:bus', [verificaToken], (req, res) => {
    let inicio = req.params.inicio;
    let fin = req.params.fin;
    let bus = req.params.bus;

    Cobro.find({ numero_bus_cobro: bus }).find({ fecha_hora_cobro: { $gte: inicio, $lte: fin } }).populate('id_tarjeta').populate('id_bus_cobro').exec((err, cobro) => {
        if (err) {
            return res.status(400).send({ message: "No se encontro ningun cobro." });
        }
        res.json({
            cobro: cobro
        });
    });
});

/* Guardar Cobro */

function CobroAdd(cobro) {
    cobro.save((err, CobroStored) => {
        if (err) {
            return false
        } else {
            if (!CobroStored) {
                return false
            } else {
                return true
            }
        }
    });
}

/* Bloquear Tarjeta */

function BloquearTarjeta(codigo_tarjeta) {
    Tarjeta.updateOne({ codigo: codigo_tarjeta }, { disponible: false }, (err, TarjetaActivado) => {
        if (err) {
            console.log(err);
        } else {
            if (!TarjetaActivado) {
            } else {
                return false;
            }
        }
    });
}
/* Bloqueo de tarjeta */

function RazonBloqueo(codigo_tarjeta, razon) {
    Tarjeta.updateOne({ codigo: codigo_tarjeta }, { bloqueo: razon }, (err, TarjetaActivado) => {
        if (err) {
            console.log(err);
        } else {
            if (!TarjetaActivado) {
            } else {
                return false;
            }
        }
    });
}

/* Actualizacion de tarjeta */
function ActualizarTarjeta(codigo_tarjeta, valor_tarjeta) {
    Tarjeta.updateOne({ codigo: codigo_tarjeta }, { valor_tarjeta: valor_tarjeta }, (err, TarjetaActivado) => {
        if (err) {
            console.log(err);
        } else {
            if (!TarjetaActivado) {
            } else {
                return false;
            }
        }
    });
}

/* Agregar un cobro */

app.post('/AgregarCobro', function (req, res) {
    const cobro = new Cobro();
    const { codigo_tarjeta, valor_Tarjeta, numero_bus_cobro, valor_pagado } = req.body;
    cobro.codigo_tarjeta = codigo_tarjeta;
    cobro.numero_bus_cobro = numero_bus_cobro;
    cobro.fecha_hora_cobro = f;
    cobro.valor_pagado = valor_pagado;

    Tarjeta.find({ codigo: codigo_tarjeta }).populate('descripcion').exec((err, tarjeta) => {
        if (err) {
            res.json({
                mesanje: false
            });
        } else {
            try {
                if (tarjeta[0].disponible) {
                    if (valor_Tarjeta == tarjeta[0].valor_tarjeta && valor_pagado == tarjeta[0].descripcion.valor) {
                        if (valor_Tarjeta > valor_pagado) {
                            CobroAdd(cobro);
                            let Nvalor = 0;
                            Nvalor = valor_Tarjeta - valor_pagado;
                            ActualizarTarjeta(codigo_tarjeta, Nvalor.toFixed(2));
                            res.json({
                                mesanje: true
                            });
                        } else {
                            res.json({
                                mesanje: "Saldo Insuficiente"
                            });
                        }

                    } else {
                        BloquearTarjeta(codigo_tarjeta)
                        RazonBloqueo(codigo_tarjeta, "Tarjeta Modificada")
                        res.json({
                            mesanje: false
                        });
                    }
                } else {
                    res.json({
                        mesanje: "Tarjeta Bloqueada"
                    });
                }
            } catch (error) {
                res.json({
                    mesanje: "Tarjeta no existe"
                });
            }
        }

    });
});

module.exports = app;