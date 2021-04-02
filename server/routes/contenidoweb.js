const express = require('express');
const app = express();
const Contenido = require('../models/ContenidoWeb_Modulo');
const multipart = require('connect-multiparty');
const md_upload_avatar = multipart({ uploadDir: "./uploads/Fondo" });
const path = require("path");
const fs = require("fs");
const { verificaToken, verificarRol } = require('../middlewares/autenticacion');

/* Agregar Contenido */
app.post('/AddContenido', function (req, res) {
    const contenido = new Contenido();
    const { titulo, con, order, disponible } = req.body;
    contenido.titulo = titulo;
    contenido.contenido = con;
    contenido.fondo = "";
    contenido.order = order;
    contenido.disponible = disponible;

    contenido.save((err, createdMenu) => {
        if (err) {
            console.log(err)
            res.status(500).send({ message: "Error del servidor." });
        } else {
            if (!createdMenu) {
                res.status(404).send({ message: "Error al crear el Contenido Web" });
            } else {
                res.status(200).send({ message: "Contenido Web creado correctamente." });
            }
        }
    });
});

app.get('/ObtenerContenido', function (req, res) {
    Contenido.find().sort({ order: "asc" }).exec((err, contenidoStored) => {
        if (err) {
            console.log(err)
            res.status(500).send({ message: "Error del servidor." });
        } else {
            if (!contenidoStored) {
                res.status(404).send({
                    message: "No se ha encontrado ningun Contenido Web."
                });
            } else {
                res.status(200).send({ contenido: contenidoStored });
            }
        }
    });
});

app.put('/ActualizarContenido/:id', [verificaToken], function (req, res) {
    let contenidoData = req.body;
    const params = req.params;
    Contenido.findByIdAndUpdate(params.id, contenidoData, (err, contenidoUpdate) => {
        if (err) {
            res.status(500).send({ message: "Error del servidor." });
        } else {
            if (!contenidoUpdate) {
                res.status(404).send({ message: "No se ha encontrado ningun contenido web." });
            } else {
                res.status(200).send({ message: "Contenido Web Actualizado correctamente." });
            }
        }
    });
});

app.put('/ActivarContenido/:id', [verificaToken], function (req, res) {

    const { id } = req.params;
    const { disponible } = req.body;

    Contenido.findByIdAndUpdate(id, { disponible }, (err, contenidoStored) => {
        if (err) {
            res.status(500).send({ message: "Erro del servidor." });
        } else {
            if (!contenidoStored) {
                res.status(404).send({ message: "no se ha encontrado el Contenido Web." });
            } else {
                if (disponible === true) {
                    res.status(200).send({ message: "Contenido Web activado correctamente." });
                } else {
                    res.status(200).send({ message: "Contenido Web desactivado correctamente." });
                }
            }
        }
    });
});

app.delete('/BorrarContenido/:id', [verificaToken], function (req, res) {
    const { id } = req.params;

    Contenido.findByIdAndRemove(id, (err, contenidoDeleted) => {
        if (err) {
            res.status(500).send({ message: "Error del servidor." });
        } else {
            if (!contenidoDeleted) {
                res.status(404).send({ message: "Contenido Web no encontrado." });
            } else {
                res
                    .status(200)
                    .send({ message: "El Contenido Web ha sido eliminado correctamente." });
            }
        }
    });
});

/* Actualizar el Fondo */

app.put('/ActualizarFondo/:id', [verificaToken, md_upload_avatar], function (req, res) {
    const body = req.params;
    Contenido.findById({ _id: body.id }, (err, contenidoData) => {
        if (err) {
            res.status(500).send({ message: "Error del servidor." });
        } else {
            if (!contenidoData) {
                res.status(404).send({ message: "Nose ha encontrado ningun Contenido Web." });
            } else {
                let conten = contenidoData;
                if (req.files) {
                    let filePath = req.files.fondo.path;
                    let fileSplit = filePath.split("/");
                    let fileName = fileSplit[2];
                    let extSplit = fileName.split(".");
                    let fileExt = extSplit[1];
                    if (fileExt !== "png" && fileExt !== "jpg") {
                        res.status(400).send({
                            message:
                                "La extension de la imagen no es valida. (Extensiones permitidas: .png y .jpg)"
                        });
                    } else {
                        conten.fondo = fileName;
                        Contenido.findByIdAndUpdate({ _id: body.id }, conten, (err, CResult) => {
                            if (err) {
                                res.status(500).send({ message: "Error del servidor." });
                            } else {
                                if (!CResult) {
                                    res.status(404).send({ message: "No se ha encontrado ningun Contenido Web." });
                                } else {
                                    res.status(200).send({ FondoName: fileName });
                                }
                            }
                        }
                        );
                    }
                }
            }
        }
    });
});

/* Obteber el url del Fondo */

app.get('/ObtenerURLFondo/:fondoName', function (req, res) {

    const fondoName = req.params.fondoName;
    const filePath = "./uploads/Fondo/" + fondoName;

    fs.exists(filePath, exists => {
        if (!exists) {
            res.status(404).send({ message: "El fondo del Contenido Web no existe." });
        } else {
            res.sendFile(path.resolve(filePath));
        }
    });
});

module.exports = app;