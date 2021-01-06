const jwt = require('jsonwebtoken');


// verificar token

let verificaToken = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'token no valido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
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

}



module.exports = {
    verificaToken,
    verificarRol
}