const express = require("express");
const router = express.Router();
const { queryDatabase } = require("../../services/db/query");
const msj = require("../../templates/messages");
const { getActiveDeviceClients, getDeviceClientById, checkDuplicateDeviceClient, insertDeviceClient, updateDeviceClient, deleteDeviceClient } = require("./query");

router.get("/get", async (req, res) => {
  try {
    const query = getActiveDeviceClients();
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

router.get("/getById/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const query = getDeviceClientById(id);
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

router.post("/post", async (req, res) => {
  const idclient = req.body.idclient;
  const idevice = req.body.idevice;

  try {
    // Verificar si ya existe la combinación idclient e idevice
    const duplicateCheckQuery = checkDuplicateDeviceClient(idclient, idevice);
    const duplicateCheckResult = await queryDatabase(duplicateCheckQuery);

    if (duplicateCheckResult.length > 0) {
      res.status(400).send({ message: msj.duplicatedDeviceClient });
    } else {
      // Si no existe, realizar la inserción
      const insertQuery = insertDeviceClient(idclient, idevice);
      const insertResult = await queryDatabase(insertQuery);

      if (insertResult.affectedRows === 1) {
        res.status(200).send({ message: msj.successPost });
      } else {
        res.status(500).send({ message: msj.errorQuery });
      }
    }
  } catch (err) {
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  const idclient = req.body.idclient;
  const idevice = req.body.idevice;

  try {
    // Verificar si ya existe la combinación idclient e idevice (excluyendo el registro actual)
    const duplicateCheckQuery = checkDuplicateDeviceClient(idclient, idevice, id);
    const duplicateCheckResult = await queryDatabase(duplicateCheckQuery);

    if (duplicateCheckResult.length > 0) {
      res.status(400).send({ message: msj.duplicatedEntry });
    } else {
      // Actualizar los campos específicos
      const updateQuery = updateDeviceClient(id, idclient, idevice);
      const updateResult = await queryDatabase(updateQuery);

      if (updateResult.affectedRows === 1) {
        res.status(200).send({ message: msj.successPut });
      } else {
        res.status(500).send({ message: msj.errorQuery });
      }
    }
  } catch (err) {
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const deleteQuery = deleteDeviceClient(id);
    const deleteResult = await queryDatabase(deleteQuery.query, deleteQuery.values);

    if (deleteResult.affectedRows === 1) {
      res.status(200).send({ message: msj.successDelete });
    } else {
      res.status(500).send({ message: msj.errorQuery });
    }
  } catch (err) {
    res.status(500).send({ message: msj.errorQuery });
  }
});

module.exports = router;
