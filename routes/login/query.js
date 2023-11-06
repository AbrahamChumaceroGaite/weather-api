const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
//Funcion para comparar contraseñas
function comparePassword(contrasena, hash) {
    return bcrypt.compareSync(contrasena, hash);
}

function getUser(ci) {
    return {
        query: `SELECT ur.id, p.name, p.ci, ur.pass, r.rol FROM person p
        JOIN user u ON p.id = u.idperson
        JOIN user_rol ur ON u.id = ur.iduser
        JOIN rol r ON ur.idrol = r.id WHERE ci = ?`,
        value: [ci]
    };
}

function generateAuthToken(user) {
    const payload = {
        name: user.nombre,
        userId: user.id
    };

    const options = {
        expiresIn: '1h', // Define la expiración del token (1 hora en este caso)
    };

    const secretKey = 'Omp4Bko8zb'; // Reemplaza esto con tu propia clave secreta

    const token = jwt.sign(payload, secretKey, options);
    return token;
}

module.exports = {
    getUser,
    comparePassword,
    generateAuthToken
};