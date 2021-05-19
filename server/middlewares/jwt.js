const jwt = require("jwt-simple");
const moment = require("moment");

const SECRET_KEY = "gR7cH9Svfj8JLe4UNIONGhs48hheb3902nh5DsA";

exports.createAccessToken = function (user) {
  const payload = {
    id: user._id,
    id_persona: user.id_persona,
    Usuario: user.nombre_usuario,
    avatar: user.avatar,
    correo: user.correo,
    rol: user.id_rol,
    createToken: moment().unix(),
    exp: moment().add(1, "hours").unix(),
  };

  return jwt.encode(payload, SECRET_KEY);
};

exports.createRefreshToken = function (user) {
  const payload = {
    id: user._id,
    exp: moment().add(1, "days").unix(),
  };

  return jwt.encode(payload, SECRET_KEY);
};

exports.decodedToken = function (token) {
  return jwt.decode(token, SECRET_KEY, true);
};

exports.createAccessTokenApp = function (user) {
  const payload = {
    id: user[0]._id,
    id_persona: user[0].id_persona._id,
    cedula_persona: user[0].id_persona.cedula_persona,
    id_tarjeta_pasajero: user[0].id_tarjeta_pasajero._id,
    id_tipo_pasajero: user[0].id_tipo_pasajero._id,
    disponible: user[0].disponible,
    createToken: moment().unix(),
    exp: moment().add(1, "hours").unix(),
  };

  return jwt.encode(payload, SECRET_KEY);
};

exports.createRefreshTokenApp = function (user) {
  const payload = {
    id: user._id,
    exp: moment().add(1, "days").unix(),
  };

  return jwt.encode(payload, SECRET_KEY);
};
