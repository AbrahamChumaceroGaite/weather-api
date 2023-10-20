const express = require("express");
const router = express.Router();
const db = require("../services/db");

router.get("/get", (req, res) => {
  const sql = `SELECT m.id, d.name as "department", p.name as "province",  m.name, p.createdAt from municipality m JOIN province p on m.idprovince = p.id JOIN department d on p.iddepartment = d.id WHERE m.deleted = 0`
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
    const sql= `SELECT * FROM municipality WHERE id = ${id}`;
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
  const idprovince = req.body.idprovince;
  const sql = `INSERT INTO municipality (idprovince, name, deleted) VALUES (${idprovince}, '${name}', 0)`;
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
  const idprovince = req.body.idprovince;
  const sql = `UPDATE municipality SET idprovince=${idprovince}, name='${name}' WHERE id = ${id}`;
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
  db.query(`UPDATE municipality SET deleted = 1 WHERE id = ${id}`, (err, results) => {
    if (err) {
      res.status(500).send({ message: "Error: ", err });
    } else {
      res.send(results);
    }
  });
});

module.exports = router;