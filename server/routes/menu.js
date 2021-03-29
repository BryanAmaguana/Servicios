const express = require('express');
const app = express();
const Menu = require('../models/Menu_Modulo');
const { verificaToken, verificarRol } = require('../middlewares/autenticacion');

/* Agregar menu */
app.post('/AddMenu', [verificaToken], function (req, res) {
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
});


app.get('/ObtenerMenu', function (req, res) {
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
});


app.put('/ActualizarMenu/:id', [verificaToken], function (req, res) {
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
});

app.put('/ActivarMenu/:id', [verificaToken], function (req, res) {

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
});


app.delete('/BorrarMenu/:id', [verificaToken, verificarRol], function (req, res) {
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
});


module.exports = app;