const express = require("express");
const { verificaToken, verificarRol } = require("../middlewares/autenticacion");
const Pasajero = require("../models/Pasajero_Modulo");
const Tarjeta = require("../models/Tarjeta_Modulo");
const jwt = require("../middlewares/jwt");

const app = express();

/* Listado de pasajeros paginados */

app.get("/ObtenerPasajero/:disponible/:desde/:limite", [verificaToken], (req, res) => {
  try {
    let disponible = req.params.disponible;
    const desde = req.params.desde;
    const limite = req.params.limite;
    Pasajero.find({ disponible: disponible }).skip(Number(desde)).limit(Number(limite)).sort({ cedula_persona: 1 }).populate("id_persona")
      .populate("id_tarjeta_pasajero").populate("id_tipo_pasajero").exec((err, pasajero) => {
        if (err) {
          return res
            .status(400)
            .send({ message: "No se encontro ningun pasajero." });
        }
        res.json({
          pasajero: pasajero,
        });
      });
  } catch (error) {
    console.log("Error: ObtenerPasajero");
    console.log(error);
  }

});

/* Agregar un pasajero */
app.post("/AgregarPasajero", function (req, res) {
  try {
    const pasajero = new Pasajero();
    const { id_persona, cedula_persona, id_tarjeta_pasajero, id_tipo_pasajero } =
      req.body;
    pasajero.id_persona = id_persona;
    pasajero.cedula_persona = cedula_persona;
    pasajero.id_tarjeta_pasajero = id_tarjeta_pasajero;
    pasajero.id_tipo_pasajero = id_tipo_pasajero;
    pasajero.disponible = true;
    pasajero.save((err, PasajeroStored) => {
      if (err) {
        res.status(500).send({ message: "El Pasajero ya existe." });
      } else {
        if (!PasajeroStored) {
          res.status(404).send({ message: "Error al crear el Pasajero." });
        } else {
          res.status(200).send({ message: "Pasajero creado exitosamente." });
        }
      }
    });
  } catch (error) {
    console.log("Error: AgregarPasajero");
    console.log(error);
  }

});

/* Activar/Desactivar Pasajero por el Id */
app.put("/ActivarPasajero/:id", [verificaToken, verificarRol], function activatePasajero(req, res) {
  try {
    const { id } = req.params;
    const { disponible } = req.body;
    Pasajero.findByIdAndUpdate(
      { _id: id },
      { disponible },
      (err, PasajeroActivado) => {
        if (err) {
          res.status(500).send({ message: "Error del servidor." });
        } else {
          if (!PasajeroActivado) {
            res
              .status(404)
              .send({ message: "No se ha encontrado ningun Pasajero." });
          } else {
            if (disponible) {
              res
                .status(200)
                .send({ message: "Pasajero activado correctamente." });
            } else {
              res
                .status(200)
                .send({ message: "Pasajero desactivado correctamente." });
            }
          }
        }
      }
    );
  } catch (error) {
    console.log("Error: ActivarPasajero");
    console.log(error);
  }

});

/* Eliminar un Pasajero */

app.delete("/BorrarPasajero/:id", [verificaToken, verificarRol], function (req, res) {
  try {
    const { id } = req.params;
    let usuario = req.user;
    Pasajero.findByIdAndRemove(id, (err, PasajeroDeleted) => {
      if (err) {
        res.status(500).send({ message: "Error del servidor." });
      } else {
        if (!PasajeroDeleted) {
          res.status(404).send({ message: "Pasajero no encontrado." });
        } else {
          res
            .status(200)
            .send({ message: "El Pasajero ha sido eliminado correctamente." });
        }
      }
    });
  } catch (error) {
    console.log("Error: BorrarPasajero");
    console.log(error);
  }
});

/* Actualizar Pasajero */

app.put("/ActualizarPasajero/:id", [verificaToken], function (req, res) {
  try {
    let PasajeroData = req.body;
    const params = req.params;

    Pasajero.findByIdAndUpdate(
      { _id: params.id },
      PasajeroData,
      (err, PasajeroUpdate) => {
        if (err) {
          res.status(500).send({ message: "Datos Duplicados." });
        } else {
          if (!PasajeroUpdate) {
            res
              .status(404)
              .send({ message: "No se ha encontrado ningun Pasajero." });
          } else {
            res
              .status(200)
              .send({ message: "Pasajero actualizado correctamente." });
          }
        }
      }
    );
  } catch (error) {
    console.log("Error: ActualizarPasajero")
    console.log(error)
  }
});

app.put("/ActualizarPasajeroApp/:id", function (req, res) {
  try {
    let PasajeroData = req.body;
    const params = req.params;
    Pasajero.findByIdAndUpdate(
      { _id: params.id },
      PasajeroData,
      (err, PasajeroUpdate) => {
        if (err) {
          console.log(err)
          res.status(500).send({ message: "Datos Duplicados." });
        } else {
          if (!PasajeroUpdate) {
            res
              .status(404)
              .send({ message: "No se ha encontrado ningun Pasajero." });
          } else {
            res
              .status(200)
              .send({ message: "Pasajero actualizado correctamente." });
          }
        }
      }
    );
  } catch (error) {
    console.log("Error: ActualizarPasajeroApp");
    console.log(error);
  }

});

/* Buscar Pasajero por la cedula*/

app.get("/BuscarPasajeroCedula/:cedula_persona/:disponible", (req, res) => {
  try {
    const cedula_persona = req.params.cedula_persona;
    const disponible = req.params.disponible;
    Pasajero.find({
      cedula_persona: { $regex: `${cedula_persona}`, $options: "i" },
    })
      .find({ disponible: disponible })
      .populate("id_persona")
      .populate("id_tarjeta_pasajero")
      .populate("id_tipo_pasajero")
      .exec((err, pasajero) => {
        if (err) {
          return res
            .status(400)
            .send({ message: "No se encontro ningun pasajero." });
        }
        res.json({
          pasajero: pasajero,
        });
      });
  } catch (error) {
    console.log("Error: BuscarPasajeroCedula");
    console.log(error);
  }
});

app.get("/BuscarPasajeroApp/:cedula_persona", (req, res) => {
  try {
    const id = req.params.cedula_persona;
    Pasajero.find({ _id: id })
      .populate("id_persona")
      .populate("id_tarjeta_pasajero")
      .populate("id_tipo_pasajero")
      .exec((err, pasajero) => {
        if (err) {
          return res
            .status(400)
            .send({ message: "No se encontro ningun pasajero." });
        }
        res.json({
          pasajero: pasajero,
        });
      });
  } catch (error) {
    console.log("Error: BuscarPasajeroApp");
    console.log(error);
  }
});

/* Buscar Pasajero por la cedula y codigo */

app.get("/BuscarPasajeroCedulaId/:cedula_persona/:id_tarjeta_pasajero", (req, res) => {
  try {
    const cedula_persona = req.params.cedula_persona;
    const id_tarjeta_pasajero = req.params.id_tarjeta_pasajero;

    Pasajero.find({ cedula_persona: cedula_persona })
      .find({ id_tarjeta_pasajero: id_tarjeta_pasajero })
      .populate("id_persona")
      .populate("id_tarjeta_pasajero")
      .populate("id_tipo_pasajero")
      .exec((err, pasajero) => {
        if (err) {
          return res
            .status(400)
            .send({ message: "No se encontro ningun pasajero." });
        }
        try {
          res.json({
            pasajero: pasajero,
            accessToken: jwt.createAccessTokenApp(pasajero),
            refreshToken: jwt.createRefreshTokenApp(pasajero),
          });
        } catch (error) {
          return res
            .status(400)
            .send({ message: "No se encontro ningun pasajero." });
        }
      });
  } catch (error) {
    console.log("Error: BuscarPasajeroCedulaId")
    console.log(error)
  }
});

/* Buscar Pasajero por la tarjeta*/

app.get("/BuscarPasajeroTarjeta/:codigo/:disponible", [verificaToken], (req, res) => {
  try {
    const codigo = req.params.codigo;
    const disponible = req.params.disponible;

    Tarjeta.find({ codigo: codigo }).exec((err, tarjeta) => {
      if (err) {
        return res
          .status(400)
          .send({ message: "No se encontro ninguna tarjeta." });
      } else {
        try {
          Pasajero.find({ id_tarjeta_pasajero: tarjeta[0].id })
            .find({ disponible: disponible })
            .populate("id_persona")
            .populate("id_tarjeta_pasajero")
            .populate("id_tipo_pasajero")
            .exec((err, pasajero) => {
              if (err) {
                return res
                  .status(400)
                  .send({ message: "No se encontro ningun pasajero." });
              }
              res.json({
                pasajero: pasajero,
              });
            });
        } catch (error) {
          res.json({
            mesanje: "Tarjeta no existe",
          });
        }
      }
    });
  } catch (error) {
    console.log("Error: BuscarPasajeroTarjeta");
    console.log(error);
  }

});

module.exports = app;
