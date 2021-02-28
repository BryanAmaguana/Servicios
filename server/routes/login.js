const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/Modulousuario');
const app = express();
const jwt = require('../middlewares/jwt');


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

/* app.post('/login', (req, res) => {

    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario incorrecto'
                }
            });
        }

        if (bcrypt.compareSync(body.contrasena, usuarioDB.contrasena)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Contraseña incorrecto'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    });
}); */

module.exports = app;