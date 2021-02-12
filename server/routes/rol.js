const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const Rol = require('../models/rol');

const app = express();

/* Obtener lista de rol */
app.get('/ObtenerRol', verificaToken, function(req, res) {

    Rol.find().exec((err, rol) => {
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
app.get('/CantidadRol', verificaToken, function(req, res) {

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

app.post('/AgregarRol', verificaToken, function(req, res) {
    let body = req.body;
    let rol = new Rol({
        nombre: body.nombre,
        descripcion: body.descripcion,
        disponible: body.disponible
    });

    rol.save((err, rolDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            rol: rolDB
        });
    });
});

/* Actualizar un rol */

app.put('ActualizarRol/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Rol.findById(id, (err, RolDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!RolDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Id no existe'
                }
            });
        }

        RolDB.nombre = body.nombre;
        RolDB.descripcion = body.descripcion;
        RolDB.disponible = body.disponible;

        RolDB.save((err, RolActualizado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                rol: RolActualizado
            });
        });
    });
});




/* Eliminar un rol */
app.delete('/BorrarRol/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Rol.findById(id, (err, RolDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!RolDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Id no existe'
                }
            });
        }

        RolDB.disponible = false;

        RolDB.save((err, RolBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                rol: RolBorrado,
                message: 'Rol Borrada'
            });
        });
    });
});



module.exports = app;