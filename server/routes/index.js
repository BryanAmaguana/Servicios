const express = require('express');

const app = express();

app.use(require('./persona'));
app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./rol'));

module.exports = app;