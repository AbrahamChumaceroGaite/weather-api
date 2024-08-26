const express = require("express");
const router = express();
const verifyToken = require('../../middleware/middleware');
const { queryDatabase } = require("../../services/db/query");
const msj = require("../../templates/messages");
const { getData, getDataLast, getDeviceIdLocation, insertDeviceData, deleteDevice, getDataTable, getTotalDataTable, getDataByDevice, calculateHours } = require("./query-device");
const { checkExistingIdentity, checkExistingIdentityUpdate, getDevicesIdentity, getLazy, getTotalRecords, getDeviceIdentityById, getUnusedDeviceIdentities, insertDeviceIdentity, updateDeviceIdentity, deleteDeviceIdentity, getDevicesIdentityByClient } = require("./query-identity");
const { GetUserNameAutor, GetMessageFromCode, GetSuscribersUserAdmin, GetUsersAdmin, InsertUserReport } = require('../../services/web_push/shared-querys');
const { newDeviceUser } = require('../../templates/payload');
const { PushNotification } = require('../../services/web_push/push-notification');

module.exports = (io) => {

  router.get("/get/list/last", verifyToken, async (req, res) => {
    const id = req.query.idevice;
    try {
      const { query, values } = await getDataLast(id);
      const deviceLast = await queryDatabase(query, values);

      if (deviceLast.length === 0) {
        res.status(404).send({ message: msj.notFound });
      } else {
        res.send(deviceLast);
      }
    } catch (err) {
      console.log(err)
      res.status(500).send({ message: msj.errorQuery });
    }
  });

  router.get('/get/list/data', verifyToken, async (req, res) => {
    const { idevice, startDate, endDate } = req.query;
    try {
      const { query, values } = await getData(idevice, startDate, endDate);
      const deviceData = await queryDatabase(query, values);
      const {queryDevice, valuesDevice} = await getDataByDevice(idevice);
      const data = await queryDatabase(queryDevice, valuesDevice);
      const hours = calculateHours(data);

      if (deviceData.length === 0) {
        res.status(404).send({ message: msj.notFound });
      } else {
        res.send({device: deviceData, hour: hours});
      }
    } catch (err) {
      console.log(err)
      res.status(500).send({ message: msj.errorQuery });
    }
  });

  router.get('/getLazy', verifyToken, async (req, res) => {
    const { first, rows, globalFilter, sortField, sortOrder, startDate, endDate } = req.query;
    const startIndex = parseInt(first);
    const numRows = parseInt(rows);
    try {
      const { query, values }  = await getDataTable(startIndex, numRows, globalFilter, sortField, sortOrder, startDate, endDate);
      const deviceData = await queryDatabase(query, values);
      const { queryR, valuesR } = await getTotalDataTable(startDate, endDate, globalFilter)
      const totalR = await queryDatabase(queryR, valuesR);
      const total = totalR[0].totalRecords;

      if (total.length === 0) {
        res.status(404).send({ message: msj.emptyQuery });
      } else {
        res.send({ items: deviceData, totalRecords: total });
      }
    } catch (err) {
      console.log(err)
      res.status(500).send({ message: msj.errorQuery });
    }
  });

  router.post("/post/data", async (req, res) => {
    console.log("IP DE ORIGEN: ", req.ip)
    try {
      const data = req.body;    
      const {iddevice} = req.body;
      const { querylocation, valueslocation } = await getDeviceIdLocation(iddevice);
      const resultL = await queryDatabase(querylocation, valueslocation);
      if (resultL.length === 0) {
        res.status(404).send({ message: msj.notFound });
      } else {
        const idlocation = resultL[0].idlocation;
        const id = resultL[0].id;
        const { query, values } = insertDeviceData(id, idlocation, data);
        const result = await queryDatabase(query, values);
       
        if (result.affectedRows === 1) {
          io.emit('devicedata', '');
          res.status(200).send({ message: msj.successPost });
        } else {
          res.status(500).send({ message: msj.errorQuery });
        }
      }

    } catch (err) {
      console.log("ERROR AL INSERTAR DATOS: ", err)
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
      console.log(err)
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
      console.log(err)
      res.status(500).send({ message: msj.errorQuery });
    }
  });

  router.get("/get/identity/ByClient/", verifyToken, async (req, res) => {
    const id = req.query.id;
    try {
      const query = await getDevicesIdentityByClient(id);
      const results = await queryDatabase(query.queryClient, query.valueClient);

      if (results.length === 0) {
        res.status(404).send({ message: msj.notFound });
      } else {
        res.send(results);
      }
    } catch (err) {
      console.log(err)
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
      console.log(err)
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
      console.log(err)
      res.status(500).send({ message: msj.errorQuery });
    }
  });

  router.post("/post/identity", verifyToken, async (req, res) => {
    const { name, idlocation, status, idautor } = req.body;
    try {
      const { queryCheck, valueCheck } = await checkExistingIdentity(name)
      const existingDevice = await queryDatabase(queryCheck, valueCheck);

      if (existingDevice.length > 0) {
        res.status(400).send({ message: msj.duplicatedDevice });
      } else {
        const { query, values } = await insertDeviceIdentity(name, idlocation, status, idautor);
        const result = await queryDatabase(query, values);

        if (result.affectedRows === 1) {

          const { queryAutor, valuesAutor } = await GetUserNameAutor(idautor);
          const resultsAutor = await queryDatabase(queryAutor, valuesAutor);
          const autor = resultsAutor[0].name;
          const { queryCode, valueCode } = await GetMessageFromCode(2035);
          const resultsCode = await queryDatabase(queryCode, valueCode);
          const contentId = resultsCode[0].id;
          const content = resultsCode[0].message;
          const payload = await newDeviceUser(autor, name, content);
          const resultsSuscribers = await queryDatabase(GetSuscribersUserAdmin());
          const subscriber = resultsSuscribers
          io.emit('notification', '');
          const admins = await queryDatabase(GetUsersAdmin());

          for (let i = 0; i < admins.length; i++) {
            const { querInsert, valuesInsert } = InsertUserReport(admins[i].id, contentId, payload.notification.body);
            await queryDatabase(querInsert, valuesInsert);
          }

          for (let i = 0; i < resultsSuscribers.length; i++) {
            await PushNotification(resultsSuscribers[i], payload);
          }

          res.status(201).send({ message: msj.successPost });
        } else {
          res.status(500).send({ message: msj.errorQuery });
        }
      }
    } catch (err) {
      console.log(err)
      res.status(500).send({ message: msj.errorQuery });
    }
  });

  router.put("/update/identity/:id", verifyToken, async (req, res) => {
    const id = req.params.id;
    const { idlocation, name, status, idautor } = req.body;

    try {
      const { queryCheck, valueCheck } = await checkExistingIdentityUpdate(name, id)
      const existingDevice = await queryDatabase(queryCheck, valueCheck);
      console.log(existingDevice)
      if (existingDevice.length > 0) {
        res.status(400).send({ message: msj.duplicatedDevice });
      } else {
        const { query, values } = updateDeviceIdentity(id, name, idlocation, status, idautor);
        const result = await queryDatabase(query, values);

        if (result.affectedRows === 1) {
          res.status(201).send({ message: msj.successPut });
        } else {
          res.status(500).send({ message: msj.errorQuery });
        }
      }
    } catch (err) {
      console.log(err)
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
      console.log(err)
      res.status(500).send({ message: msj.errorQuery });
    }
  });

  return router;
}
