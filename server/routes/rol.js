const express = require('express');
const { verificaToken, verificarRol } = require('../middlewares/autenticacion');
const Rol = require('../models/rol');

const app = express();

/* Obtener lista de rol */
app.get('/ObtenerRol', verificaToken, function (req, res) {

    Rol.find({}).sort({ nombre: 1 }).exec((err, rol) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            rol,
        });
    });
});

/* Obtener rol por el nombre */

app.get('/BuscarRolNombre/:nombre', verificaToken, (req, res) => {
    let nombre = req.params.nombre;

    Rol.find({ nombre: nombre }).exec((err, rol) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!rol) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Rol no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            rol
        });
    });
});

/* Obtener rol por el id */

app.get('/BuscarRolId/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Rol.find({ _id: id }).exec((err, rol) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!rol) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Rol no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            rol
        });
    });
});

/* Obtener cantidad de roles */
app.get('/CantidadRol', verificaToken, function (req, res) {

    Rol.find({ disponible: true })
        .exec((err, rol) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            //aqui va las condiciones para que cuente
            Rol.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    cuantos: conteo
                });
            });
        });
});

/* Agregar un rol */

app.post('/AgregarRol', [verificaToken, verificarRol], function (req, res) {
    const rol = new Rol();
    const { nombre, descripcion } = req.body;
    rol.nombre = nombre;
    rol.descripcion = descripcion;

    rol.save((err, RolStored) => {
        if (err) {
            res.status(500).send({ message: "El rol ya existe." });
        } else {
            if (!RolStored) {
                res.status(404).send({ message: "Error al crear el rol." });
            } else {
                res.status(200).send({ message: "Rol creado exitosamente." });
            }
        }
    });

});

/* Actualizar un rol */

app.put('/ActualizarRol/:id', [verificaToken, verificarRol], function (req, res) {
    let RolData = req.body;
    const params = req.params;
    Rol.findByIdAndUpdate({ _id: params.id }, RolData, (err, RolUpdate) => {
        if (err) {
            res.status(500).send({ message: "Datos Duplicados." });
        } else {
            if (!RolUpdate) {
                res
                    .status(404)
                    .send({ message: "No se ha encontrado ningun rol." });
            } else {
                res.status(200).send({ message: "Rol actualizado correctamente." });
            }
        }
    });
});


/* Eliminar un rol */

app.delete('/BorrarRol/:id', [verificaToken, verificarRol], function (req, res) {
    const { id } = req.params;

    Rol.findByIdAndRemove(id, (err, userDeleted) => {
        if (err) {
            res.status(500).send({ message: "Error del servidor." });
        } else {
            if (!userDeleted) {
                res.status(404).send({ message: "Rol no encontrado." });
            } else {
                res
                    .status(200)
                    .send({ message: "El rol ha sido eliminado correctamente." });
            }
        }
    });
});

module.exports = app;