const express = require("express");
const router = express.Router();
const verifyToken = require('../../middleware/middleware');
const { queryDatabase } = require("../../services/db/query");
const msj = require("../../templates/messages");
const { getData, getDataLast,  getDeviceIdLocation, insertDeviceData, deleteDevice } = require("./query-device");
const { getDevicesIdentity, getLazy, getTotalRecords, getDeviceIdentityById, getUnusedDeviceIdentities, insertDeviceIdentity, updateDeviceIdentity, deleteDeviceIdentity } = require("./query-identity");

router.get("/get/list/last", verifyToken, async (req, res) => {
  const id = req.query.idevice;
  try {
    const {query, values} = await getDataLast(id);
    const deviceLast = await queryDatabase(query, values);

    if (deviceLast.length === 0) {
      res.status(404).send({ message: msj.notFound });
    } else {
      res.send(deviceLast);
    }
  } catch (err) {
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.get('/get/list/data', verifyToken, async (req, res) => {
  const { idevice, startDate, endDate } = req.query;
  try {
    const { query, values } = await getData(idevice, startDate, endDate);
    const deviceData = await queryDatabase(query, values );

    if (deviceData.length === 0) {
      res.status(404).send({ message: msj.notFound });
    } else {     
      res.send(deviceData);
    }
  } catch (err) {
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.post("/post", async (req, res) => {
  try {
    const data = req.body;
    const idDevice = data.iddevice;
    const { querylocation, valueslocation } = await getDeviceIdLocation(idDevice);
    const resultL = await queryDatabase(querylocation, valueslocation);
    if (resultL.length === 0) {
      res.status(404).send({ message: msj.notFound });
    } else {
      const idlocation = resultL[0].idlocation;
      const { query, values } = insertDeviceData(idlocation, data);
      const result = await queryDatabase(query, values);

      if (result.affectedRows === 1) {
        res.status(200).send({ message: msj.successPost });
      } else {
        res.status(500).send({ message: msj.errorQuery });
      }
    }

  } catch (err) {
    console.log(err)
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

// DEVICE TABLE

router.get("/get/identity", verifyToken, async (req, res) => {
  try {
    const query = await getDevicesIdentity();
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

router.get("/get/identity/list", verifyToken, async (req, res) => {
  try {
    const query = await getUnusedDeviceIdentities();
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

router.get("/get/identity/Lazy", async (req, res) => {
  const { first, rows, globalFilter, sortField, sortOrder } = req.query;
  const startIndex = parseInt(first);
  const numRows = parseInt(rows);
  try {
    const personQuery = await getLazy(startIndex, numRows, globalFilter, sortField, sortOrder);
    const persons = await queryDatabase(personQuery);
    const totalR = await queryDatabase(getTotalRecords())
    const total = totalR[0].totalRecords;

    if (total.length === 0) {
      res.status(404).send({ message: msj.emptyQuery });
    } else {
      res.send({ items: persons, totalRecords: total });
    }
  } catch (err) {
    console.log(err)
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
    const { query, values } = await insertDeviceIdentity(idlocation, name, status);
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