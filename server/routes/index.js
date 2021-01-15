const express = require('express');

const app = express();

app.use(require('./persona'));
app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./rol'));
app.use(require('./bus'));
app.use(require('./tarjeta'));
app.use(require('./ruta'));
app.use(require('./recorrido'));
app.use(require('./pasajero'));
app.use(require('./cobro_pasaje'));
app.use(require('./recargas'));
app.use(require('./historial_recargador'));
app.use(require('./historial_admin'));



module.exports = app;