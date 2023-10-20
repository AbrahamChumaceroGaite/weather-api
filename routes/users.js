const express = require("express");
const router = express.Router();
const db = require("../services/db");
const bcrypt = require("bcrypt");

router.get("/get", (req, res) => {
  const sql = `SELECT u.*, r.rol as "rol" FROM users u JOIN rol r on u.idrol = r.id WHERE u.deleted = 0`
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send({ message: "Error: ", err });
    } else {
      res.send(results);
    }
  });
});

router.get("/getById/:id", (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM users WHERE id = ${id}`
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send({ message: "Error: ", err });
    } else {
      res.send(results);
    }
  });
});

router.post("/post", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const idrol = req.body.idrol;
  const pass = req.body.pass;
  // Generar un salt para encriptar la contraseña
  const salt = bcrypt.genSaltSync(10);
  // Encriptar la contraseña con el salt
  const hashedPassword = bcrypt.hashSync(pass, salt);
  /*   console.log("NUEVA PASSWORD: ", hashedPassword); */
  const sql = `INSERT INTO users (name, email, idrol, pass, deleted) VALUES ('${name}','${email}',${idrol},'${hashedPassword}', 0)`;
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send({ message: "Error: ", err });
    } else {
      res.send(results);
    }
  });
});

router.put("/update/:id", (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const email = req.body.email;
  const idrol = req.body.idrol;
  const pass = req.body.pass;
  // Generar un salt para encriptar la contraseña
  const salt = bcrypt.genSaltSync(10);
  // Encriptar la contraseña con el salt
  const hashedPassword = bcrypt.hashSync(pass, salt);
  /*   console.log("NUEVA PASSWORD: ", hashedPassword); */
  const sql = `UPDATE users SET name='${name}',email='${email}',idrol=${idrol}, pass='${hashedPassword}' WHERE id = ${id}`;
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send({ message: "Error: ", err });
    } else {
      res.send(results);
    }
  });
});

router.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  db.query(`UPDATE users SET deleted = 1 WHERE id = ${id}`, (err, results) => {
    if (err) {
      res.status(500).send({ message: "Error: ", err });
    } else {
      res.send(results);
    }
  });
});

module.exports = router;
