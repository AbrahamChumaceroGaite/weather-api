const express = require("express");
const router = express.Router();
const db = require("../services/db");

router.get("/get", (req, res) => {
  const sql = `SELECT dc.id, c.name as "client", d.id as "idevice", d.name as "device", dc.createdAt FROM deviceclient dc JOIN client c on dc.idclient = c.id JOIN device_id d on dc.idevice = d.id WHERE dc.deleted = 0 AND d.status = 1 AND d.deleted = 0`
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
  const sql= `SELECT * FROM deviceclient WHERE id = ${id}`;
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send({ message: "Error: ", err });
    } else {
      res.send(results);
    }
  });
});

router.post("/post", (req, res) => {
  const idclient = req.body.idclient;
  const idevice = req.body.idevice;
  const sql = `INSERT INTO deviceclient (idclient, idevice, deleted) VALUES (${idclient},${idevice},0)`;
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
  const idclient = req.body.idclient;
  const idevice = req.body.idevice;
  const sql = `UPDATE deviceclient SET idclient=${idclient}, idevice=${idevice} WHERE id = ${id}`;
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
  db.query(`UPDATE deviceclient SET deleted = 1 WHERE id = ${id}`, (err, results) => {
    if (err) {
      res.status(500).send({ message: "Error: ", err });
    } else {
      res.send(results);
    }
  });
});

module.exports = router;
