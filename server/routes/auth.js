const express = require("express");
const AuthController = require("../middlewares/auth");

const api = express.Router();

api.post("/refrescarToken", AuthController.refreshAccessToken);

module.exports = api;