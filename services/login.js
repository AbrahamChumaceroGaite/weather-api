const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../services/db");

// Función para generar un token JWT
function generateToken(data) {
  return jwt.sign(data, "secreto", { expiresIn: "1h" });
}

// Función para verificar la contraseña ingresada con la almacenada en la base de datos
function comparePassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

// Endpoint de inicio de sesión
function login(req, res) {
  const body = req.body;
  const email = req.body.User;
  const password = req.body.Password;

  // Buscar el usuario en la base de datos por correo
  const query = `SELECT * from users WHERE email = '${email}'`;
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: "Error en el servidor" });
    } else {
      if (results.length > 0) {
        const user = results[0];
         // Comparar la contraseña ingresada con la almacenada en la base de datos
   /*   console.log("Respuesta BD: ", user);
        console.log("Contraseña Entrante: ", password);
        console.log("Contraseña Encriptada: ", user.Password); */
/*         if (comparePassword(password, user.Password)) {
          // Generar un token JWT con los datos del usuario
          const token = generateToken({
            email: user.email,
            role: user.Role,
            parishId: user.ParishId,
          });
          const jsonrespuesta = ({ token, email: user.email, role: user.Role, parishId: user.ParishId });
          res.json(jsonrespuesta);
        } else {
          res.status(401).json({ error: "Contraseña incorrecta" });
        } */
        //En caso de no usar el desencriptador, esto solo para pruebas
           const token = generateToken({
          email: user.email,
          Role: user.Role,
        }); 
        res.json({ token, email: user.email, Role: user.Role });
      } else {
        res.status(401).json({ error: "Usuario no encontrado" });
      }
    }
  });
}

module.exports = login;
