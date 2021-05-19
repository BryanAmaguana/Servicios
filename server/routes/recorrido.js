const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const Recorrido = require('../models/Recorrido_Modulo');
const app = express();


/* Obtener todos los recorridos */

app.get('/ObtenerRecorrido', verificaToken, function (req, res) {
    try {

        Recorrido.find({ disponible: true }).exec((err, tarjeta) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                tarjeta,
            });
        });

    } catch (error) {
        console.log("Error: ObtenerRecorrido");
        console.log(error);

    }
});

/* Obtener los numeros totales de recorridos */

app.get('/CantidadRecorridos', verificaToken, function (req, res) {

    try {
        Recorrido.find({ disponible: true })
            .exec((err, recorrido) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                //aqui va las condiciones para que cuente
                Recorrido.count({}, (err, conteo) => {
                    res.json({
                        ok: true,
                        cuantos: conteo
                    });
                });
            });

    } catch (error) {
        console.log("Error: CantidadREcorridos");
        console.log(error);

    }

});

/* Obtener los recorridos de un bus */

app.get('/BuscarRecorridoBus/:numero', verificaToken, (req, res) => {

    try {
        let numero = req.params.numero;

        Recorrido.find({ disponible: true }, { numero: numero }).exec((err, recorrido) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!recorrido) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Recorrido no encontrado'
                    }
                });
            }
            res.json({
                ok: true,
                recorrido
            });
        });

    } catch (error) {
        console.log("Error:BuscarRecorrido");
        console.log(error);

    }
});


/* Obtener los buses en un recorrido */

app.get('/BuscarBusRecorrdio/:id_ruta_recorrido', verificaToken, (req, res) => {

    try {
        let id_ruta_recorrido = req.params.id_ruta_recorrido;

        Recorrido.find({ disponible: true }, { id_ruta_recorrido: id_ruta_recorrido }).exec((err, recorrido) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!recorrido) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Buses no encontrado'
                    }
                });
            }
            res.json({
                ok: true,
                recorrido
            });
        });

    } catch (error) {
        console.log("Error: BuscarBusRecorrido");
        console.log(error);

    }
});


/* Obtener los numero de buses de un recorrido */

app.get('/CantidadBusRecorridos/:id_ruta_recorrido', verificaToken, function (req, res) {

    try {
        let id_ruta_recorrido = req.params.id_ruta_recorrido;
        Recorrido.find({ disponible: true }, { id_ruta_recorrido: id_ruta_recorrido })
            .exec((err, recorrido) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                //aqui va las condiciones para que cuente
                Recorrido.count({}, (err, conteo) => {
                    res.json({
                        ok: true,
                        cuantos: conteo
                    });
                });
            });

    } catch (error) {
        console.log("Error: CantidadRecorrdio");
        console.log(error);

    }

});

/* Obtener los numero de recorridos de un bus */

app.get('/CantidadBusRecorridos/:numero', verificaToken, function (req, res) {
    try {
        let numero = req.params.numero;
        Recorrido.find({ disponible: true }, { numero: numero })
            .exec((err, recorrido) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                //aqui va las condiciones para que cuente
                Recorrido.count({}, (err, conteo) => {
                    res.json({
                        ok: true,
                        cuantos: conteo
                    });
                });
            });

    } catch (error) {
        console.log("Error: CantidadBusRecorridos");
        console.log(error);

    }

});


/* Agregar un recorrido */

app.post('/AgregarRecorrido', verificaToken, function (req, res) {

    try {
        let body = req.body;
        let recorrido = new Recorrido({
            id_bus_recorrido: body.id_bus,
            id_ruta_recorrido: body.id_ruta,
            fecha_inicio_recorrido: body.fecha_inicio,
            fecha_fin_recorrido: body.fecha_fin,
            disponible: body.disponible
        });

        recorrido.save((err, RecorridoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                recorrido: RecorridoDB
            });
        });

    } catch (error) {
        console.log("Error: AgregarRecorrido");
        console.log(error);

    }
});


/* Actualizar un recorrido */

app.put('ActualizarRecorrido/:id', verificaToken, (req, res) => {

    try {
        let id = req.params.id;
        let body = req.body;

        Recorrido.findById(id, (err, RecorridoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!RecorridoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El Id no existe'
                    }
                });
            }
            RecorridoDB.id_bus_recorrido = body.id_bus;
            RecorridoDB.id_ruta_recorrido = body.id_ruta;
            RecorridoDB.fecha_inicio_recorrido = body.fecha_inicio;
            RecorridoDB.fecha_fin_recorrido = body.fecha_fin;
            RecorridoDB.disponible = body.disponible;

            RecorridoDB.save((err, RecorridoActualizado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    recorrido: RecorridoActualizado
                });
            });
        });

    } catch (error) {
        console.log("Error: ActualizarRecorrido");
        console.log(error);

    }


});

/* Eliminar un recorrido */

app.delete('/BorrarRecorrido/:id', verificaToken, (req, res) => {

    try {
        let id = req.params.id;

        Recorrido.findById(id, (err, RecorridoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!RecorridoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El Id no existe'
                    }
                });
            }

            RecorridoDB.disponible = false;

            RecorridoDB.save((err, RecorridoBorrado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    recorrido: RecorridoBorrado,
                    message: 'Recorrido Borrado'
                });
            });
        });

    } catch (error) {
        console.log("Error: BorrarRecorrido");
        console.log(error);

    }

});

module.exports = app;