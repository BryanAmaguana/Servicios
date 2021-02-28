const jwt = require("jwt-simple");
const moment = require("moment");


// verificar token

const SECRET_KEY = "gR7cH9Svfj8JLe4UNIONGhs48hheb3902nh5DsA";

let verificaToken  = (req, res, next) => {
    if (!req.headers.authorization) {
      return res
        .status(403)
        .send({ message: "La peticion no tiene la cabecera de Autenticacion." });
    }
    const token = req.headers.authorization.replace(/['"]+/g, "");
    try {
      var payload = jwt.decode(token, SECRET_KEY);
  
      if (payload.exp <= moment().unix()) {
        return res.status(404).send({ message: "El token ha expirado." });
      }
    } catch (ex) {
      return res.status(404).send({ message: "Token invalido." });
    }
    req.user = payload;
    next();
  };


let verificarRol = (req, res, next) => {
    let usuario = req.user;
    if (usuario.rol == '5ff62a2d9e8b3e14d287f16c') {
        next();
    } else {
          return res.status(404).send({ message: "Usted no es administrador." });
    }
};

module.exports = {
    verificarRol,
    verificaToken
}