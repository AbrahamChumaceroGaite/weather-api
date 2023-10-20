const express = require("express");
const router = express.Router();
const db = require("../services/db");

router.get("/get", (req, res) => {
  const sql = `SELECT c.id, d.name as "department", p.name as "province",  m.name as "municipality", c.name, c.createdAt from community c JOIN municipality m on c.idmunicipality = m.id JOIN province p on m.idprovince = p.id JOIN department d on p.iddepartment = d.id WHERE c.deleted = 0`
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
  const sql= `SELECT * FROM community WHERE id = ${id}`;
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
  const idmunicipality = req.body.idmunicipality;
  const sql = `INSERT INTO community (idmunicipality, name, deleted) VALUES (${idmunicipality}, '${name}', 0)`;
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
  const idmunicipality = req.body.idmunicipality;
  const sql = `UPDATE community SET idmunicipality=${idmunicipality}, name='${name}' WHERE id = ${id}`;
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
  db.query(`UPDATE community SET deleted = 1 WHERE id = ${id}`, (err, results) => {
    if (err) {
      res.status(500).send({ message: "Error: ", err });
    } else {
      res.send(results);
    }
  });
});

module.exports = router;