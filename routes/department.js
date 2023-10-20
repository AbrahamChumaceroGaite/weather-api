const express = require("express");
const router = express.Router();
const db = require("../services/db");

router.get("/get", (req, res) => {
  db.query("SELECT * FROM department WHERE deleted = 0", (err, results) => {
    if (err) {
      res.status(500).send({ message: "Error: ", err });
    } else {
      res.send(results);
    }
  });
});

router.get("/getById/:id", (req, res) => {
  const id = req.params.id;
  const sql= `SELECT * FROM department WHERE id = ${id}`;
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
  const sql = `INSERT INTO department (name, deleted) VALUES ('${name}', 0)`;
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
  const sql = `UPDATE department SET name='${name}' WHERE id = ${id}`;
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).send({ message: "Error: ", err });
    } else {
      res.status(200).send({ message: "OK: ", result });
    }
  });
});

router.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  db.query(`UPDATE department SET deleted = 1 WHERE id = ${id}`, (err, results) => {
    if (err) {
      res.status(500).send({ message: "Error: ", err });
    } else {
      res.send(results);
    }
  });
});

module.exports = router;