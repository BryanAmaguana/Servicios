const express = require("express");
const { verificaToken, verificarRol } = require("../middlewares/autenticacion");
const Tarjeta = require("../models/Tarjeta_Modulo");
const app = express();

app.get("/Tarjeta", (req, res) => {
  try {
    Tarjeta.find({}).exec((err, tarjeta) => {
      if (err) {
        return res
          .status(400)
          .send({ message: "No se encontro ninguna tarjeta." });
      }
      res.json({
        tarjeta: tarjeta,
      });
    });

  } catch (error) {
    console.log("Error: Tarjeta");
    console.log(error);

  }

});

/* Obtener tarjetas Activas y desactivadas */

app.get("/ObtenerTarjeta/:disponible/:desde/:limite", [verificaToken], (req, res) => {
  try {
    let disponible = req.params.disponible;
    const desde = req.params.desde;
    const limite = req.params.limite;
    Tarjeta.find({ disponible: disponible }).skip(Number(desde)).limit(Number(limite)).sort({ codigo: 1 })
      .populate("descripcion").exec((err, tarjeta) => {
        if (err) {
          return res
            .status(400)
            .send({ message: "No se encontro ninguna tarjeta." });
        }
        res.json({
          tarjeta: tarjeta,
        });
      });

  } catch (error) {
    console.log("Error: ObtenerTarjeta");
    console.log(error);

  }

});

/* Agregar una tarjeta */

app.post("/AgregarTarjeta", [verificaToken], function (req, res) {

  try {
    const tarjeta = new Tarjeta();
    const { codigo, valor_tarjeta, descripcion } = req.body;
    tarjeta.codigo = codigo;
    tarjeta.valor_tarjeta = valor_tarjeta;
    tarjeta.disponible = true;
    tarjeta.descripcion = descripcion;
    tarjeta.bloqueo = "";
    tarjeta.save((err, TarjetaStored) => {
      if (err) {
        res.status(500).send({ error: "La tarjeta ya existe." });
      } else {
        if (!TarjetaStored) {
          res.status(404).send({ error: "Error al crear la tarjeta." });
        } else {
          res.status(200).send({ok: "Tarjeta creada exitosamente." });
        }
      }
    });

  } catch (error) {
    console.log("Error: AgregarTarjeta");
    console.log(error);

  }
});

/* Agregar una tarjeta Inicializar*/

app.get("/InicializarTarjeta/:codigo/:valor_tarjeta/:descripcion", function (req, res) {

  try {
    const tarjeta = new Tarjeta();
    const codigo = req.params.codigo;
    const valor_tarjeta = req.params.valor_tarjeta;
    const descripcion = req.params.descripcion;
    tarjeta.codigo = codigo;
    tarjeta.valor_tarjeta = valor_tarjeta;
    tarjeta.disponible = true;
    tarjeta.bloqueo = "";
    if (descripcion == 1) {
      /* Adulto */
      tarjeta.descripcion = "604e6c86e20cbe0f62d9d35d";
    } else if (descripcion == 2) {
      /* Estudiante */
      tarjeta.descripcion = "604e6c71e20cbe0f62d9d35c";
    } else if (descripcion == 3) {
      /* tercera edad */
      tarjeta.descripcion = "604e6c95e20cbe0f62d9d35e";
    }

    tarjeta.save((err, TarjetaStored) => {
      if (err) {
  Tarjeta.updateOne({ codigo: codigo }, (err, TarjetaStored) => {
            if (err) {
                es.status(404).send({ error: "Error al Inicializar la tarjeta." });
            } else {
                if (!TarjetaActivado) {
                } else {
                    return false;
                }
            }
        });
      } else {
        if (!TarjetaStored) {
          res.status(404).send({ error: "Error al crear la tarjeta." });
        } else {
          res.status(200).send({ ok: "Tarjeta creada exitosamente." });
        }
      }
    });

  } catch (error) {
    console.log("Error: InicializarTarjeta");
    console.log(error);

  }
});

/* Activar desactivar una tarjeta */

app.put("/ActivarTarjeta/:id", [verificaToken], function activateTarjeta(req, res) {
  try {
    const { id } = req.params;
    const { disponible } = req.body;
    Tarjeta.findByIdAndUpdate(
      { _id: id },
      { disponible: disponible },
      (err, TarjetaActivado) => {
        if (err) {
          res.status(500).send({ message: "Error del servidor." });
        } else {
          if (!TarjetaActivado) {
            res
              .status(404)
              .send({ message: "No se ha encontrado ninguna Tarjeta." });
          } else {
            if (disponible) {
              res
                .status(200)
                .send({ message: "Tarjeta activada correctamente." });
            } else {
              res
                .status(200)
                .send({ message: "Tarjeta desactivada correctamente." });
            }
          }
        }
      }
    );
  } catch (error) {
    console.log("Error: ActivarTarjeta");
    console.log(error);
  }
});




app.put("/ActivarTarjetaApp/:id", function activateTarjeta(req, res) {
  try {
    const { id } = req.params;
    const { disponible } = req.body;
    Tarjeta.findByIdAndUpdate(
      { _id: id },
      { disponible: disponible },
      (err, TarjetaActivado) => {
        if (err) {
          res.status(500).send({ message: "Error del servidor." });
        } else {
          if (!TarjetaActivado) {
            res
              .status(404)
              .send({ message: "No se ha encontrado ninguna Tarjeta." });
          } else {
            if (disponible) {
              res
                .status(200)
                .send({ message: "Tarjeta activada correctamente." });
            } else {
              res
                .status(200)
                .send({ message: "Tarjeta desactivada correctamente." });
            }
          }
        }
      }
    );
  } catch (error) {
    console.log("Error: ActivarTarjeta");
    console.log(error);
  }
});



/* Eliminar una Tarjeta */

app.get("/BorrarTarjeta/:id", function (req, res) {

  try {

    const { id } = req.params;
    Tarjeta.findOneAndDelete(id, (err, TarjetaDeleted) => {
      if (err) {
        res.status(500).send({ message: "Error del servidor." });
      } else {
        if (!TarjetaDeleted) {
          res.status(404).send({ message: "Tarjeta no encontrada." });
        } else {
          res
            .status(200)
            .send({ message: "La tarjeta ha sido eliminada correctamente." });
        }
      }
    });

  } catch (error) {
    console.log("Error: BorrarTarjeta");
    console.log(error);

  }

});

/* Actualizar Tarjeta */

app.put("/ActualizarTarjeta/:id", [verificaToken, verificarRol], function (req, res) {

  try {
    let TarjetaData = req.body;
    const params = req.params;

    Tarjeta.findByIdAndUpdate(
      { _id: params.id },
      TarjetaData,
      (err, TarjetaUpdate) => {
        if (err) {
          res.status(500).send({ message: "Datos Duplicados." });
        } else {
          if (!TarjetaUpdate) {
            res
              .status(404)
              .send({ message: "No se ha encontrado ninguna Tarjeta." });
          } else {
            res
              .status(200)
              .send({ message: "Tarjeta actualizada correctamente." });
          }
        }
      }
    );

  } catch (error) {
    console.log("Error: ActualizarTarjeta");
    console.log(error);
  }

});

/* Buscar Tarjeta por el codigo */

app.get("/ObtenerTarjetaCodigo/:codigo/:disponible", [verificaToken], (req, res) => {
  try {
    let codigo = req.params.codigo;
    const disponible = req.params.disponible;
    Tarjeta.find({ codigo: { $regex: `${codigo}`, $options: "i" } })
      .find({ disponible: disponible })
      .populate("descripcion")
      .exec((err, tarjeta) => {
        if (err) {
          return res
            .status(400)
            .send({ message: "No se encontro ninguna tarjeta." });
        }
        res.json({
          tarjeta: tarjeta,
        });
      });

  } catch (error) {
    console.log("Error: ObtenerTarjetaCodigo");
    console.log(error);
  }
});

app.get("/ObtenerTarjetaCodigoApp/:codigo/:disponible", (req, res) => {
  try {
    let codigo = req.params.codigo;
    const disponible = req.params.disponible;
    Tarjeta.find({ codigo: { $regex: `${codigo}`, $options: "i" } })
      .find({ disponible: disponible })
      .populate("descripcion")
      .exec((err, tarjeta) => {
        if (err) {
          return res
            .status(400)
            .send({ message: "No se encontro ninguna tarjeta." });
        }
        res.json({
          tarjeta: tarjeta,
        });
      });

  } catch (error) {
    console.log("Error: ObtenerTarjetaCodigo");
    console.log(error);

  }

});

app.get("/ObtenerTarjetaCodigoApp2/:codigo", (req, res) => {
  try {
    let codigo = req.params.codigo;
    Tarjeta.find({ codigo: codigo })
      .populate("descripcion")
      .exec((err, tarjeta) => {
        if (err) {
          return res
            .status(400)
            .send({ message: "No se encontro ninguna tarjeta." });
        }
        res.json({
          tarjeta: tarjeta,
        });
      });

  } catch (error) {
    console.log("Error: ObtenerTarjetaCodigoApp2");
    console.log(error);

  }

});

app.get("/ObtenerTarjetaCodigoP/:codigo", [verificaToken], (req, res) => {
  try {
    let codigo = req.params.codigo;
    Tarjeta.findOne({ disponible: true, codigo: codigo })
      .populate("descripcion")
      .then((tarjeta) => {
        if (!tarjeta) {
          res
            .status(404)
            .send({ message: "No se ha encontrado ninguna tarjeta." });
        } else {
          res.status(200).send({ tarjeta: tarjeta });
        }
      });

  } catch (error) {
    console.log("Error: ObtenerTarjetaCodigoP");
    console.log(error);

  }

});

module.exports = app;
