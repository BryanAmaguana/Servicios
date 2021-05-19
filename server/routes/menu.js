const express = require('express');
const app = express();
const Menu = require('../models/Menu_Modulo');
const { verificaToken, verificarRol } = require('../middlewares/autenticacion');

/* Agregar menu */
app.post('/AddMenu', [verificaToken, verificarRol], function (req, res) {
  try {
    const menu = new Menu();

    const { titulo, url, order, disponible } = req.body;
    menu.titulo = titulo;
    menu.url = url;
    menu.order = order;
    menu.disponible = disponible;

    menu.save((err, createdMenu) => {
      if (err) {
        res.status(500).send({ message: "Error del servidor." });
      } else {
        if (!createdMenu) {
          res.status(404).send({ message: "Error al crear el Menu." });
        } else {
          res.status(200).send({ message: "Menu creado correctamente." });
        }
      }
    });
  } catch (error) {
    console.log("Error: AddMuenu");
    console.log(error);
  }

});


app.get('/ObtenerMenu', function (req, res) {
  try {
    Menu.find().sort({ order: "asc" }).exec((err, menusStored) => {
      if (err) {
        res.status(500).send({ message: "Error del servidor." });
      } else {
        if (!menusStored) {
          res.status(404).send({
            message: "No se ha encontrado ningun elemento en le menu."
          });
        } else {
          res.status(200).send({ menu: menusStored });
        }
      }
    });
  } catch (error) {
    console.log("Error: ObtenerMenu");
    console.log(error);
  }

});


app.put('/ActualizarMenu/:id', [verificaToken, verificarRol], function (req, res) {
  try {
    let menuData = req.body;
    const params = req.params;

    Menu.findByIdAndUpdate(params.id, menuData, (err, menuUpdate) => {
      if (err) {
        res.status(500).send({ message: "Error del servidor." });
      } else {
        if (!menuUpdate) {
          res.status(404).send({ message: "No se ha encontrado ningun menu." });
        } else {
          res.status(200).send({ message: "Menu Actualizado correctamente." });
        }
      }
    });
  } catch (error) {
    console.log("Error: ActualizarMenu");
    console.log(error);
  }
});

app.put('/ActivarMenu/:id', [verificaToken], function (req, res) {
  try {

    const { id } = req.params;
    const { disponible } = req.body;

    Menu.findByIdAndUpdate(id, { disponible }, (err, menuStored) => {
      if (err) {
        res.status(500).send({ message: "Erro del servidor." });
      } else {
        if (!menuStored) {
          res.status(404).send({ message: "no se ha encontrado el menu." });
        } else {
          if (disponible === true) {
            res.status(200).send({ message: "Menu activado correctamente." });
          } else {
            res.status(200).send({ message: "Menu desactivado correctamente." });
          }
        }
      }
    });
  } catch (error) {
    console.log("Error: ActivarMenu");
    console.log(error);
  }

});


app.delete('/BorrarMenu/:id', [verificaToken, verificarRol], function (req, res) {
  try {
    const { id } = req.params;
    Menu.findByIdAndRemove(id, (err, menuDeleted) => {
      if (err) {
        res.status(500).send({ message: "Error del servidor." });
      } else {
        if (!menuDeleted) {
          res.status(404).send({ message: "Menu no encontrado." });
        } else {
          res
            .status(200)
            .send({ message: "El menu ha sido eliminado correctamente." });
        }
      }
    });
  } catch (error) {
    console.log("Error: BorrarMenu");
    console.log(error);
  }
});


module.exports = app;