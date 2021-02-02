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
      console.log(ex);
      return res.status(404).send({ message: "Token invalido." });
    }
    req.user = payload;
    next();
  };


let verificarRol = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.rol === 'administrador') {
        next();

    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }

};



module.exports = {
    verificarRol,
    verificaToken
}