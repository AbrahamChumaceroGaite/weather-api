const express = require("express");
const router = express.Router();
const db = require("../services/db");

router.get("/get", (req, res) => {
  const sql = `SELECT l.id, d.name as "department", p.name as "province",  m.name as "municipality", c.name as "community", l.name, l.createdAt from location l JOIN community c on l.idcommunity = c.id JOIN municipality m on c.idmunicipality = m.id JOIN province p on m.idprovince = p.id JOIN department d on p.iddepartment = d.id WHERE c.deleted = 0`
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
    const sql= `SELECT * FROM location WHERE id = ${id}`;
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
  const idcommunity = req.body.idcommunity;
  const sql = `INSERT INTO location (idcommunity, name, deleted) VALUES (${idcommunity}, '${name}', 0)`;
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
  const idcommunity = req.body.idcommunity;
  const sql = `UPDATE location SET idcommunity=${idcommunity}, name='${name}' WHERE id = ${id}`;
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
  db.query(`UPDATE location SET deleted = 1 WHERE id = ${id}`, (err, results) => {
    if (err) {
      res.status(500).send({ message: "Error: ", err });
    } else {
      res.send(results);
    }
  });
});

module.exports = router;