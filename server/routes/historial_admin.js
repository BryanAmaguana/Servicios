const express = require('express');
const Historial_admin = require('../models/Historial_Admin_Modulo');
const app = express();
//const moment = require('moment-timezone');
//const f = moment().tz("America/Guayaquil").format();

/* Agregar hisorial */

let AgregarHistorial = (id_usuario, accion_admin, descripcion) => {
    try {
        const Historial = new Historial_admin();
        var f = new Date();
        Historial.fecha_accion = f;
        Historial.accion_admin = accion_admin;
        Historial.id_usuario = id_usuario;
        Historial.descripcion = descripcion;

        Historial.save((err, HistorialStored) => {
            if (!HistorialStored) {
                console.log("Error al ingresar." + err)
            }
        });
    } catch (error) {
        console.log("Error: AgregarHistorial");
        console.log(error);
    }

}

module.exports = {
    AgregarHistorial
}