const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ ok: false, message: 'Acceso denegado. Token no proporcionado o en formato incorrecto.' });
    }

    const token = authHeader.split(' ')[1]; // Extraemos el token del formato "Bearer <token>"
    try {
        // jwt.verify() decodifica el token y comprueba si la firma es válida
        const payloadDecodificado = jwt.verify(token, process.env.JWT_SECRET);

        // Guardamos el payload del token en el objeto `request` para usarlo en la ruta protegida
        req.usuario = payloadDecodificado;

        next(); // El token es válido, continuamos a la ruta solicitada

    } catch (error) {
        res.status(403).json({ ok: false, message: 'Token inválido o expirado.' });
    }
};

module.exports = verificarToken;