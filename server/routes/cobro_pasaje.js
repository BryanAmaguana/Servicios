const express = require('express');
const Cobro = require('../models/Cobro_Pasaje_Modulo');
const { verificaToken } = require('../middlewares/autenticacion');
const app = express();
const Tarjeta = require('../models/Tarjeta_Modulo');
const moment = require('moment-timezone');
const f = moment().tz("America/Guayaquil").format();
var ISODate = require("isodate");


/* Obtener todo pasaje por meses */


function ResolverRepetidos(lista) {
    const buses = [];
    const busesTemp = [];
    const ListTemp = [];

    var Total = 0;
    for (let i = 0; i < lista.length; i) {
        ListTemp.push(lista[i]);
        busesTemp.push(lista[i]);
        lista.splice(i, 1);
        for (let q = 0; q < lista.length; q++) {
            if (parseFloat(ListTemp[0].numero_bus_cobro) === parseFloat(lista[q].numero_bus_cobro)) {
                busesTemp.push(lista[q]);
                lista.splice(q, 1);
                q=q-1;
            }
        }
        for(let x = 0; x < busesTemp.length; x++){
            Total += busesTemp[x].valor_pagado
        }
        buses.push({Numero_bus: ListTemp[0].numero_bus_cobro, total: Total})
        ListTemp.splice(0)
        busesTemp.splice(0)
        Total = 0;
    }
    return buses;
}

app.get('/CobroMeses/:inicio/:fin', (req, res) => {
    let inicio = req.params.inicio;
    let fin = req.params.fin;
    
    Cobro.find({ fecha_hora_cobro: { $gte: inicio+'T00:00:00.000+00:00', $lte: fin+'T23:59:59.000+00:00' } }).exec((err, cobro) => {
        if (!cobro) {
            return res.status(400).send({ message: "No se encontro ningun cobro." });
        }
        res.json({
            cobro:  ResolverRepetidos(cobro)
        });
    });
});

app.get('/Cobro', (req, res) => {
    Cobro.find({  }).exec((err, cobro) => {
        if (!cobro) {
            return res.status(400).send({ message: "No se encontro ningun cobro." });
        }
        res.json({
            cobro:  ResolverRepetidos(cobro)
        });
    });
});

/* Obtener cobro pasaje sin filtrado */
app.get('/ObtenerCobroPasajeTodo/:inicio/:fin', [verificaToken], (req, res) => {
    let desde = req.params.inicio;
    let limite = req.params.fin;

    Cobro.find({}).skip(Number(desde)).limit(Number(limite)).exec((err, cobro) => {
        if (!cobro) {
            return res.status(400).send({ message: "No se encontro ningun cobro." });
        }
        res.json({
            cobro: cobro
        });
    });
});

/* Obtener cobro pasaje filtrado */
app.get('/ObtenerCobroPasaje/:inicio/:fin/:bus',/*  [verificaToken], */ (req, res) => {
    let inicio = req.params.inicio;
    let fin = req.params.fin;
    let bus = req.params.bus;
    
    Cobro.find({ numero_bus_cobro: bus }).find({ fecha_hora_cobro: { $gte:  inicio+'T00:00:00.000+00:00', $lte: fin+'T23:59:59.000+00:00' } }).populate('id_tarjeta').populate('id_bus_cobro').exec((err, cobro) => {
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

app.get('/AgregarCobro/:codigo_tarjeta/:valor_Tarjeta/:numero_bus_cobro/:valor_pagado', function (req, res) {
    const cobro = new Cobro();
    const valor_Tarjeta = req.params.valor_Tarjeta;
    const codigo_tarjeta = req.params.codigo_tarjeta;
    const numero_bus_cobro = req.params.numero_bus_cobro;
    const valor_pagado = req.params.valor_pagado;

    cobro.codigo_tarjeta = codigo_tarjeta;
    cobro.numero_bus_cobro = numero_bus_cobro;
    cobro.fecha_hora_cobro = ISODate(f);
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
                                mesanje: "Cobro ingresado Exitosamente"
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