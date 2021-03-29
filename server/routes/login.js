const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario_Modulo');
const app = express();
const jwt = require('../middlewares/jwt');
const { AgregarHistorial } = require('../routes/historial_admin');

app.post('/login',  (req, res) =>  {
    const params = req.body;
    const nombre_usuario = params.nombre_usuario;
    const contrasena = params.contrasena;
  
    Usuario.findOne({nombre_usuario}, (err, userStored) => {
      if (err) {
        res.status(500).send({ message: "Error del servidor." });;
      } else {
        if (!userStored) {
          res.status(404).send( { message: "Usuario no encontrado." });
        } else {
          bcrypt.compare(contrasena, userStored.contrasena, (err, check) => {
            if (err) {
              res.status(500).send({ message: "Error del servidor." });
            } else if (!check) {
              res.status(404).send({ message: "La contraseña es incorrecta." });
            } else {
              if (!userStored.disponible) {
                res
                  .status(200)
                  .send({ code: 200, message: "El usuario no se ha activado." });
              } else {
                res.status(200).send({
                  accessToken: jwt.createAccessToken(userStored),
                  refreshToken: jwt.createRefreshToken(userStored)
                });
              }
            }
          });
        }
      }
    });
  });

module.exports = app;