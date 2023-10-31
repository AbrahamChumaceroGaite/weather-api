const express = require("express");
const router = express.Router();
const verifyToken = require('../../middleware/middleware');
const { queryDatabase } = require("../../services/db/query");
const msj = require("../../templates/messages");
const { getDevices, getDeviceList, getDeviceListById, insertDeviceData, deleteDevice } = require("./query-device");
const { getAllDeviceIdentities, getDeviceIdentityById, getUnusedDeviceIdentities, insertDeviceIdentity, updateDeviceIdentity, deleteDeviceIdentity } = require("./query-identity");

router.get("/get", verifyToken, async (req, res) => {
  try {
    const devicesQuery = getDevices();
    const devices = await queryDatabase(devicesQuery);

    if (devices.length === 0) {
      res.status(404).send({ message: msj.notFound });
    } else {
      res.send(devices);
    }
  } catch (err) {
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.get("/get/list", verifyToken, async (req, res) => {
  try {
    const deviceListQuery = getDeviceList();
    const deviceList = await queryDatabase(deviceListQuery);

    if (deviceList.length === 0) {
      res.status(404).send({ message: msj.notFound });
    } else {
      res.send(deviceList);
    }
  } catch (err) {
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.get('/get/list/byId/:id', verifyToken, async (req, res) => {
  const id = req.params.id;
  const { startDate, endDate } = req.query;

  try {
    const { query, value } = getDeviceListById(id, startDate, endDate);
    const deviceList = await queryDatabase(query, value);

    if (deviceList.length === 0) {
      res.status(404).send({ message: msj.notFound });
    } else {
      res.send(deviceList);
    }
  } catch (err) {
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.post("/post", async (req, res) => {
  try {
    const data = req.body;

    const { query, values } = insertDeviceData(data);
    const result = await queryDatabase(query, values);

    if (result.affectedRows === 1) {
      res.status(200).send({ message: msj.successPost });
    } else {
      res.status(500).send({ message: msj.errorQuery });
    }
  } catch (err) {
    res.status(500).send({ message: msj.errorQuery });
  }
});

/* router.put("/update/:id", (req, res) => {
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
}); */

router.delete("/delete/:id", verifyToken, async (req, res) => {
  const id = req.params.id;

  try {
    const deleteQuery = deleteDevice(id);
    const result = await queryDatabase(deleteQuery.query, deleteQuery.value);

    if (result.affectedRows === 1) {
      res.status(200).send({ message: msj.successDelete });
    } else {
      res.status(404).send({ message: msj.notFound });
    }
  } catch (err) {
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.get("/get/identity/list", verifyToken, async (req, res) => {
  try {
    const query = getUnusedDeviceIdentities();
    const results = await queryDatabase(query);

    if (results.length === 0) {
      res.status(404).send({ message: msj.notFound });
    } else {
      res.send(results);
    }
  } catch (err) {
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.get("/get/identity", verifyToken, async (req, res) => {
  try {
    const query = getAllDeviceIdentities();
    const results = await queryDatabase(query);

    if (results.length === 0) {
      res.status(404).send({ message: msj.notFound });
    } else {
      res.send(results);
    }
  } catch (err) {
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.get("/get/identity/ById/:id", verifyToken, async (req, res) => {
  const id = req.params.id;

  try {
    const { query, value } = getDeviceIdentityById(id);
    const results = await queryDatabase(query, value);

    if (results.length === 0) {
      res.status(404).send({ message: msj.notFound });
    } else {
      res.send(results);
    }
  } catch (err) {
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.post("/post/identity", verifyToken, async (req, res) => {
  const { name, idlocation, status } = req.body;

  try {
    const { query, values } = insertDeviceIdentity(name, idlocation, status);
    const result = await queryDatabase(query, values);

    if (result.affectedRows === 1) {
      res.status(200).send({ message: msj.successPost });
    } else {
      res.status(500).send({ message: msj.errorQuery });
    }
  } catch (err) {
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.put("/update/identity/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  const { name, idlocation, status } = req.body;

  try {
    const { query, values } = updateDeviceIdentity(id, name, idlocation, status);
    const result = await queryDatabase(query, values);

    if (result.affectedRows === 1) {
      res.status(200).send({ message: msj.successPut });
    } else {
      res.status(500).send({ message: msj.errorQuery });
    }
  } catch (err) {
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.delete("/delete/identity/:id", verifyToken, async (req, res) => {
  const id = req.params.id;

  try {
    const deleteQuery = deleteDeviceIdentity(id);
    const result = await queryDatabase(deleteQuery.query, deleteQuery.value);

    if (result.affectedRows === 1) {
      res.status(200).send({ message: msj.successDelete });
    } else {
      res.status(404).send({ message: msj.notFound });
    }
  } catch (err) {
    res.status(500).send({ message: msj.errorQuery });
  }
});

module.exports = router;