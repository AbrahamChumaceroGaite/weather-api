const express = require("express");
const router = express.Router();
const db = require("../services/db");
const bcrypt = require("bcrypt");

router.get("/get", (req, res) => {
  const sql = `SELECT c.*, r.rol as "rol", lo.name as "location" FROM client c JOIN rol r on c.idrol = r.id JOIN location lo on c.idlocation = lo.id WHERE c.deleted = 0`
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
  const sql= `SELECT * FROM client WHERE id = ${id}`;
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send({ message: "Error: ", err });
    } else {
      res.send(results);
    }
  });
});

router.post("/post", (req, res) => {
  console.log("Data: ", req.body)
  const name = req.body.name;
  const pass = req.body.pass;
  const ci = req.body.ci;
  const idrol = req.body.idrol;
  const idlocation = req.body.idlocation;
  const number = req.body.number;
  // Generar un salt para encriptar la contraseña
  const salt = bcrypt.genSaltSync(10);
  // Encriptar la contraseña con el salt
  const hashedPassword = bcrypt.hashSync(pass, salt);
  /*   console.log("NUEVA PASSWORD: ", hashedPassword); */
  const sql = `INSERT INTO client (name, pass, ci, idrol, idlocation, number, deleted) VALUES ('${name}','${hashedPassword}',${ci},${idrol},${idlocation},${number}, 0)`;
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
  const pass = req.body.pass;
  const ci = req.body.ci;
  const idlocation = req.body.idlocation;
  const number = req.body.number;
  // Generar un salt para encriptar la contraseña
  const salt = bcrypt.genSaltSync(10);
  // Encriptar la contraseña con el salt
  const hashedPassword = bcrypt.hashSync(pass, salt);
  /*   console.log("NUEVA PASSWORD: ", hashedPassword); */
  const sql = `UPDATE client SET name='${name}', pass='${hashedPassword}', ci='${ci}', idlocation=${idlocation}, number = ${number} WHERE id = ${id}`;
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
  db.query(`UPDATE client SET deleted = 1 WHERE id = ${id}`, (err, results) => {
    if (err) {
      res.status(500).send({ message: "Error: ", err });
    } else {
      res.send(results);
    }
  });
});

module.exports = router;
