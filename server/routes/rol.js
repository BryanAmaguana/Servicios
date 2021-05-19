const express = require('express');
const { verificaToken, verificarRol } = require('../middlewares/autenticacion');
const Rol = require('../models/Rol_Modulo');
const { AgregarHistorial } = require('../routes/historial_admin');

const app = express();

/* Obtener lista de rol */
app.get('/ObtenerRol', verificaToken, function (req, res) {

    try {
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

    } catch (error) {
        console.log("Error: ObtenerRol");
        console.log(error);

    }

});

/* Obtener rol por el nombre */

app.get('/BuscarRolNombre/:nombre', verificaToken, (req, res) => {

    try {
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

    } catch (error) {
        console.log("Error: BuscarRolNombre");
        console.log(error);

    }

});

/* Obtener rol por el id */

app.get('/BuscarRolId/:id', verificaToken, (req, res) => {
    try {
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

    } catch (error) {
        console.log("Error: BuscarRolId");
        console.log(error);
    }
});

/* Obtener cantidad de roles */
app.get('/CantidadRol', verificaToken, function (req, res) {

    try {
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

    } catch (error) {
        console.log("Error: CantidadRol");
        console.log(error);

    }

});

/* Agregar un rol */

app.post('/AgregarRol', [verificaToken, verificarRol], function (req, res) {

    try {
        const rol = new Rol();
        const { nombre, descripcion } = req.body;
        rol.nombre = nombre;
        rol.descripcion = descripcion;
        let usuario = req.user;

        rol.save((err, RolStored) => {
            if (err) {
                res.status(500).send({ message: "El rol ya existe." });
            } else {
                if (!RolStored) {
                    res.status(404).send({ message: "Error al crear el rol." });
                } else {
                    res.status(200).send({ message: "Rol creado exitosamente." });
                    AgregarHistorial(usuario.id, "Creo el rol: " + rol.id);
                }
            }
        });

    } catch (error) {
        console.log("Error: AgregarRol");
        console.log(error);

    }

});

/* Actualizar un rol */

app.put('/ActualizarRol/:id', [verificaToken, verificarRol], function (req, res) {

    try {
        let RolData = req.body;
        const params = req.params;
        let usuario = req.user;
        Rol.findByIdAndUpdate(params.id, RolData, (err, RolUpdate) => {
            if (err) {
                res.status(500).send({ message: "Datos Duplicados." });
            } else {
                if (!RolUpdate) {
                    res
                        .status(404)
                        .send({ message: "No se ha encontrado ningun rol." });
                } else {
                    res.status(200).send({ message: "Rol actualizado correctamente." });
                    AgregarHistorial(usuario.id, "Actualizo el rol: " + params.id);
                }
            }
        });

    } catch (error) {
        console.log("Error: ActualizarRol");
        console.log(error);

    }
});


/* Eliminar un rol */

app.delete('/BorrarRol/:id', [verificaToken, verificarRol], function (req, res) {

    try {
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

    } catch (error) {
        console.log("Error: BorrarRol");
        console.log(error);

    }
});

module.exports = app;