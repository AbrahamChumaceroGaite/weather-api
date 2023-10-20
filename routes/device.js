const express = require("express");
const router = express.Router();
const moment = require('moment-timezone');
const db = require("../services/db");

router.get("/get", (req, res) => {
  console.log("Pediste Ver")
  db.query("SELECT * FROM device WHERE device_id IS NOT NULL ", (err, results) => {
    if (err) {
      res.status(500).send({ message: "Error: ", err });
    } else {
      res.send(results);
    }
  });
});

router.get("/get/list", (req, res) => {
  const sql = `SELECT c.name "client", de.* FROM device de LEFT JOIN device_id d on d.name = de.device_id LEFT JOIN deviceclient dc on dc.idevice = d.id LEFT JOIN client c on dc.idclient = c.id`
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send({ message: "Error: ", err });
    } else {
      res.send(results);
    }
  });
});

router.get('/get/list/byId/:id', (req, res) => {
  const id = req.params.id;
  let sql = `SELECT c.name AS client, d.id AS deviceid, de.* FROM device de 
             LEFT JOIN device_id d ON d.name = de.device_id 
             LEFT JOIN deviceclient dc ON dc.idevice = d.id 
             LEFT JOIN client c ON dc.idclient = c.id 
             WHERE d.id = ${id}`;

  const { startDate, endDate } = req.query;
  if (startDate && endDate) {
    const start = moment(startDate).utcOffset(-4, true);
    const end = moment(endDate).utcOffset(-4, true);
    if (start.isValid() && end.isValid()) {
      sql += ` AND de.createdAt >= '${start.format('YYYY-MM-DD HH:mm:ss')}' AND de.createdAt <= '${end.format('YYYY-MM-DD HH:mm:ss')}'`;
    } else {
      res.status(400).send({ message: 'Invalid date format' });
      return;
    }
  }

  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send({ message: 'Error:', err });
    } else {
      res.send(results);
    }
  });
});

router.post("/post", (req, res) => {
  console.log("llego: ", req.body)
  const device_id = req.body.device_id;
  const temp = req.body.temp;
  const hum = req.body.hum;
  const pres = req.body.pres;
  const uv = req.body.uv;
  const altitude = req.body.altitude;
  const rain = req.body.rain;
  const windf = req.body.windf;
  const winds = req.body.winds;
  const batt_level = req.body.batt_level;
  const lat = req.body.lat;
  const lon = req.body.lon;
  const number = req.body.number;
  const date = new Date();
  const createdAt = req.body.date;
  const fecha = moment.utc(date).tz('America/La_Paz').format('YYYY-MM-DD HH:mm:ss');
  const sql = `INSERT INTO device (device_id, temp, hum, pres, uv, altitude, rain, windf, winds, batt_level, lat, lon, number, createdAt) VALUES 
                                ('${device_id}',${temp},${hum},${pres},${uv},${altitude},${rain},${windf},${winds},${batt_level},${lat},${lon},${number},'${fecha}')`;
  db.query(sql, (err, result) => {
    if (err) {
    res.status(500).send({
        error: "Error al insertar los datos en la base de datos",
        errorMessage: err.message,
      });
    } else {
      res.status(200).send({ message: "OK: ", result });
    }
  });
});

router.put("/update/:id", (req, res) => {
  const id = req.params.id;
  const temp = req.body.temp;
  const hum = req.body.hum;
  const pres = req.body.pres;
  const uv = req.body.uv;
  const altitude = req.body.altitude;
  const rain = req.body.rain;
  const windf = req.body.windf;
  const winds = req.body.winds;
  const batt_level = req.body.batt_level;
  const lat = req.body.lat;
  const long = req.body.long;
  const number = req.body.number;
  const sql = `UPDATE device SET temp=${temp}, hum= ${hum},pres=${pres}, uv= ${uv},altitude=${altitude}, rain= ${rain},windf=${windf}, winds= ${winds},batt_level=${batt_level}, lat= ${lat},long=${long}, number= ${number}, WHERE id = ${id}`;
  db.query(sql, (err, result) => {
    if (err) {
       res.send(err);
    } else {
      res.status(200).send({ message: "OK: ", result });
    }
  });
});

router.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  db.query(`UPDATE device SET deleted = 1 WHERE id = ${id}`, (err, results) => {
    if (err) {
      res.status(500).send({ message: "Error: ", err });
    } else {
      res.send(results);
    }
  });
});

router.get("/get/identity/list", (req, res) => {
  const sql = `SELECT de.* FROM device_id de LEFT JOIN deviceclient c ON de.id = c.idevice WHERE c.idevice IS NULL AND de.deleted = 0 AND de.status = 1`
  db.query(sql, (err, results) => {
    if (err) {
        res.status(500).send({ message: "Error: ", err });
      } else {
        res.send(results);
      }
  });
});

router.get("/get/identity", (req, res) => {
  const sql = `SELECT de.*, lo.name as "location", d.name as "department" FROM device_id de JOIN location lo on de.idlocation = lo.id JOIN  community co on lo.idcommunity = co.id JOIN municipality m on co.idmunicipality = m.id JOIN province p on m.idprovince = p.id JOIN department d on p.iddepartment = d.id  WHERE de.deleted = 0`
  db.query(sql, (err, results) => {
    if (err) {
        res.status(500).send({ message: "Error: ", err });
      } else {
        res.send(results);
      }
  });
});

router.get("/get/identity/ById/:id", (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM device_id WHERE id = ${id}`
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send({ message: "Error: ", err });
    } else {
      res.send(results);
    }
  });
});

router.post("/post/identity", (req, res) => {
  const name = req.body.name;
  const status = req.body.status;
  const idlocation = req.body.idlocation;
  const sql = `INSERT INTO device_id (name, idlocation, status, deleted ) VALUES ('${name}', ${idlocation}, ${status}, 0)`;
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send({ message: "Error: ", err });
    } else {
      res.send(results);
    }
  });
});

router.put("/update/identity/:id", (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const status = req.body.status;  
  const idlocation =req.body.idlocation;
  const sql = `UPDATE device_id SET name='${name}', idlocation=${idlocation}, status=${status} WHERE id = ${id}`;
  db.query(sql, (err, results) =>{
    if (err) {
      res.status(500).send({ message: "Error: ", err });
    } else {
      res.send(results);
    }
  });
});

router.delete("/delete/identity/:id", (req, res) => {
  console.log(req.params)
  const id = req.params.id;
  db.query(`UPDATE device_id SET deleted = 1 WHERE id = ${id}`, (err, results) => {
    if (err) {
      res.status(500).send({ message: "Error: ", err });
    } else {
      res.send(results);
    }
  });
});

module.exports = router;