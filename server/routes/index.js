const express = require('express');

const app = express();

// Configure Header HTTP
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next();
  });

app.use(require('./rol'));
app.use(require('./persona'));
app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./bus'));
app.use(require('./tarjeta'));
app.use(require('./ruta'));
app.use(require('./recorrido'));
app.use(require('./pasajero'));
app.use(require('./cobro_pasaje'));
app.use(require('./recargas'));
app.use(require('./historial_recargador'));
app.use(require('./tipo_pasajero'));
app.use(require('./menu'));
app.use(require('./auth'));
app.use(require('./contenidoweb'));


module.exports = app;