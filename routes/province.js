const express = require("express");
const router = express.Router();
const db = require("../services/db");

router.get("/get", (req, res) => {
  const sql = ` SELECT d.name as "department", p.id, p.name, p.createdAt from province p JOIN department d on p.iddepartment = d.id WHERE p.deleted = 0`;
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
    const sql= `SELECT * FROM province WHERE id = ${id}`;
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
  const iddepartment = req.body.iddepartment;
  const sql = `INSERT INTO province (iddepartment, name, deleted) VALUES (${iddepartment}, '${name}', 0)`;
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
  const iddepartment = req.body.iddepartment;
  const sql = `UPDATE province SET iddepartment=${iddepartment}, name='${name}' WHERE id = ${id}`;
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
  db.query(`UPDATE province SET deleted = 1 WHERE id = ${id}`, (err, results) => {
    if (err) {
      res.status(500).send({ message: "Error: ", err });
    } else {
      res.send(results);
    }
  });
});

module.exports = router;