const jwt = require('jsonwebtoken');

const { SEED } = require('../config/config');


/* Verificar Token */ 

let verificaToken = (req, res, next) => {

    let token = req.get('token')

    jwt.verify(token, SEED, function(err, decoded) {
        if(err) {
            return res.status(401).json({ ok: false, err : {message: "Token no válido "} });
        }

        req.usuario = decoded.usuario
        next()

    });

    // Al parecer la librería no acepta el then y catch ver documentación
}

let verificaUsuario = (req, res, next) => {

    let usuario = req.usuario
    if(usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res
          .status(401)
          .json({ ok: false, err: { message: 'ROLE NOT VALID' } });
    }
    

}


module.exports = {
    verificaToken,
    verificaUsuario
}