const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const Recargas = require('../models/Recargas_Modulo');
const app = express();
const moment = require('moment-timezone');
const f = moment().tz("America/Guayaquil").format();
const Tarjeta = require('../models/Tarjeta_Modulo');

app.get('/Recarga', (req, res) => {
    try {
        Recargas.find({}).exec((err, recarga) => {
            if (err) {
                return res.status(400).send({ message: "No se encontro ninguna recarga." });
            }
            res.json({
                recarga: recarga
            });
        });

    } catch (error) {
        console.log("Error: Recargas");
        console.log(error);

    }
});


function ResolverRepetidos(lista) {
    try {
        const buses = [];
        const busesTemp = [];
        const ListTemp = [];
        let Nrecargas = 0;

        var Total = 0;
        for (let i = 0; i < lista.length; i) {
            ListTemp.push(lista[i]);
            busesTemp.push(lista[i]);
            lista.splice(i, 1);
            for (let q = 0; q < lista.length; q++) {
                if (ListTemp[0].nombre_usuario === lista[q].nombre_usuario) {
                    busesTemp.push(lista[q]);
                    lista.splice(q, 1);
                    q = q - 1;
                }
            }
            for (let x = 0; x < busesTemp.length; x++) {
                Total += busesTemp[x].valor_recarga
                Nrecargas += 1;
            }
            buses.push({ usuario: ListTemp[0].nombre_usuario, total: Total, Recargas: Nrecargas })
            ListTemp.splice(0)
            busesTemp.splice(0)
            Total = 0;
            Nrecargas = 0;
        }
        return buses;
    } catch (error) {
        console.log("Error: ResolverRepetidos");
        console.log(error);
    }
}

app.get('/ObtenerRecargaTotal/:desde/:limite', [verificaToken], (req, res) => {
    try {
        const inicio = req.params.desde;
        const fin = req.params.limite;
        Recargas.find({ fecha_hora_Accion: { $gte: inicio + 'T00:00:00.000+00:00', $lte: fin + 'T23:59:59.000+00:00' } }).sort({ nombre_usuario: 1 }).exec((err, recarga) => {
            if (err) {
                return res.status(400).send({ message: "No se encontro ninguna recarga." });
            }
            res.json({
                recarga: ResolverRepetidos(recarga)
            });
        });

    } catch (error) {
        console.log("Error: ObtenerRecargasTotal");
        console.log(error);
    }
});


app.get('/ObtenerRecargaTotalApp/:desde/:limite/:codigo', (req, res) => {
    try {
        const codigo = req.params.codigo;
        const inicio = req.params.desde;
        const fin = req.params.limite;
        Recargas.find({ fecha_hora_Accion: { $gte: inicio + 'T00:00:00.000+00:00', $lte: fin + 'T23:59:59.000+00:00' } }).find({ codigo_tarjeta: codigo }).exec((err, recarga) => {
            if (err) {
                return res.status(400).send({ message: "No se encontro ninguna recarga." });
            }
            res.json({
                recarga: recarga
            });
        });

    } catch (error) {
        console.log("Error: ObtenerRecargasTotal");
        console.log(error);
    }
});



/* Obtener cobro pasaje filtrado */
app.get('/ObtenerRecarga/:desde/:limite', [verificaToken], (req, res) => {
    try {
        const desde = req.params.desde;
        const limite = req.params.limite;
        Recargas.find({}).skip(Number(desde)).limit(Number(limite)).sort({ fecha_hora_Accion: 1 }).exec((err, recarga) => {
            if (err) {
                return res.status(400).send({ message: "No se encontro ninguna recarga." });
            }
            res.json({
                recarga: recarga
            });
        });

    } catch (error) {
        console.log("Error: ObtenerRecarga");
        console.log(error);

    }
});

/* Obtener cobro pasaje filtrado */
app.get('/ObtenerRecargaFiltrado/:inicio/:fin/:nombre_usuario', [verificaToken], (req, res) => {
    try {
        let inicio = req.params.inicio;
        let fin = req.params.fin;
        let nombre_usuario = req.params.nombre_usuario;

        Recargas.find({ nombre_usuario: nombre_usuario }).find({ fecha_hora_Accion: { $gte: inicio + 'T00:00:00.000+00:00', $lte: fin + 'T23:59:59.000+00:00' } }).exec((err, recarga) => {
            if (err) {
                return res.status(400).send({ message: "No se encontro ninguna recarga." });
            }
            res.json({
                recarga: recarga
            });
        });

    } catch (error) {
        console.log("Error: ObtenerRecargaFiltrado");
        console.log(error);

    }
});


/* Actualizar Tarjeta */

function ActualizarTarjeta(codigo_tarjeta, valor_Total_recarga, valor_recarga, usuario) {
    try {
        Tarjeta.updateOne({ codigo: codigo_tarjeta }, { valor_tarjeta: valor_Total_recarga }, (err, TarjetaActivado) => {
            if (err) {
                return "No se encontro tarjeta"
            } else {
                if (!TarjetaActivado) {
                } else {
                    AddRecarga(codigo_tarjeta, valor_recarga, usuario);
                    return false;
                }
            }
        });

    } catch (error) {
        console.log("Error: ActualizarTarjeta");
        console.log(error);

    }
}

function AddRecarga(codigo_tarjeta, valor_recarga, nombre_usuario) {
    try {
        const recargas = new Recargas();
        recargas.fecha_hora_Accion = f;
        recargas.valor_recarga = valor_recarga;
        recargas.codigo_tarjeta = codigo_tarjeta;
        recargas.nombre_usuario = nombre_usuario;
        recargas.save((err, RecargaStored) => {
            if (err) {
                return false
            } else {
                if (!RecargaStored) {
                    return false
                }
            }
        });

    } catch (error) {
        console.log("Error: AddRecarga");
        console.log(error);

    }
}

/* Agregar una recarga */

app.get('/AgregarRecarga/:valor_recarga/:codigo_tarjeta/:nombre_usuario', function (req, res) {
    try {
        const valor_recarga = req.params.valor_recarga;
        const codigo_tarjeta = req.params.codigo_tarjeta;
        const nombre_usuario = req.params.nombre_usuario;

        Tarjeta.find({ codigo: codigo_tarjeta }).exec((err, tarjeta) => {
            if (err) {
                res.json({
                    error: "Tarjeta no existe"
                });
            } else {
                try {
                    let Nvalor = 0;
                    Nvalor = parseFloat(tarjeta[0].valor_tarjeta) + parseFloat(valor_recarga);
                    ActualizarTarjeta(codigo_tarjeta, Nvalor.toFixed(2), valor_recarga, nombre_usuario);
                    res.json({
                        ok: "Recarga exitosa"
                    });
                } catch (error) {
                    res.json({
                        error: "Tarjeta no existe"
                    });
                }
            }
        });
    } catch (error) {
        console.log("Error: AgregarRecarga");
        console.log(error);
    }
});


module.exports = app;
