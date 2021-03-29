const express = require('express');
const Historial_admin = require('../models/Historial_Admin_Modulo');
const app = express();

/* Agregar hisorial */

let AgregarHistorial = (id_usuario, accion_admin, descripcion) => {
    const Historial = new Historial_admin();
    const f = new Date();
    Historial.fecha_accion = f;
    Historial.accion_admin = accion_admin;
    Historial.id_usuario = id_usuario;
    Historial.descripcion = descripcion;

    Historial.save((err, HistorialStored) => {
        if (!HistorialStored) {
            console.log("Error al ingresar." + err)
        }
    });
}

module.exports = {
    AgregarHistorial
}