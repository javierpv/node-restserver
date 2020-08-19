const jwt = require('jsonwebtoken');

// ===============
// Verifica TOKEN
// ===============
let verificarToken = (req, res, next) => {

    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if(err){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;

        next();

    });

    
};


// ===============
// Verifica AdminRole
// ===============
let verificarAdminRole = (req, res, next) => {

    if(req.usuario.role != 'ADMIN_ROLE'){
        return res.json({
            ok:false,
            err: {
                message: 'Rol incorrecto.'
            }
        });
    }

    next();
    
};

module.exports = {
    verificarToken,
    verificarAdminRole
}