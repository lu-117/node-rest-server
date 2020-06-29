const jwt = require('jsonwebtoken');

const { response } = require("../routes/usuario");

// ===========================
//   Verificar Token
// ===========================

let verificaToken = (req, res, next) => {
    let token = req.get('token');
    //console.log(token);

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: 'Token no valido'
            })
        }
        req.usuario = decoded.usuario;
        next();
    });

};

// ===========================
//   Verificar Admin Rol
// ===========================

let verificaAdminRol = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role === 'AMIN_ROLE') {
        next();
    } else {
        res.json({
            ok: false,
            err: {
                message: 'El usuaruo no es adminostrador'
            }
        });
    }
};

module.exports = {
    verificaToken,
    verificaAdminRol
}