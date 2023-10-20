const express = require("express");
const router = express.Router();
const db = require("../services/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/login", (req, res) => {
  const email = req.body.email;
  const pass = req.body.pass;

  const sql = `SELECT * FROM users WHERE email = '${email}'`;
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send({ message: "Error: ", err });
    } else {
      if (results.length === 0) {
        res.status(401).send({ message: "Invalid credentials" });
      } else {
        const user = results[0];
        const passMatch = bcrypt.compareSync(pass, user.pass);
        if (!passMatch) {
          res.status(401).send({ message: "Invalid credentials" });
        } else {
          const token = generateAuthToken(user);
          res.send({ token });
        }
      }
    }
  });
});

function generateAuthToken(user) {
  const payload = {
    name: user.name,
    userId: user.id,
    roleId: user.idrol,
  };

  const options = {
    expiresIn: "1h", // Define la expiración del token (1 hora en este caso)
  };

  const secretKey = "mySecretKey"; // Reemplaza esto con tu propia clave secreta

  const token = jwt.sign(payload, secretKey, options);
  return token;
}

module.exports = router;
