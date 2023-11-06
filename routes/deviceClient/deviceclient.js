const express = require("express");
const router = express.Router();
const { queryDatabase } = require("../../services/db/query");
const msj = require("../../templates/messages");
const { getDeviceClients, getDeviceClientById, checkDuplicateDeviceClient, insertDeviceClient, updateDeviceClient, deleteDeviceClient } = require("./query");

router.get("/get", async (req, res) => {
  try {
    const results = await queryDatabase(getDeviceClients());

    if (results.length === 0) {
      res.status(404).send({ message: msj.notFound });
    } else {
      res.send(results);
    }
  }catch (err) {
    console.log(err)
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.get("/getById/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const { query, values } = getDeviceClientById(id);
    const results = await queryDatabase(query, values);

    if (results.length === 0) {
      res.status(404).send({ message: msj.notFound });
    } else {
      res.send(results);
    }
  }catch (err) {
    console.log(err)
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.post("/post", async (req, res) => {
  const {idclient, idevice, idautor} = req.body
  try {
    // Verificar si ya existe la combinación idclient e idevice
    const { query, values }  = await checkDuplicateDeviceClient(idclient, idevice);
    const duplicateCheckResult = await queryDatabase(query, values );

    if (duplicateCheckResult.length > 0) {
      res.status(400).send({ message: msj.duplicatedDeviceClient });
    } else {
  
      const { query, values }  = await insertDeviceClient(idclient, idevice, idautor);
      const insertResult = await queryDatabase(query, values );

      if (insertResult.affectedRows === 1) {
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

router.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  const {idclient, idevice, idautor} = req.body
  try {
    
    const { query, values } = await checkDuplicateDeviceClient(idclient, idevice);    
    const duplicateCheckResult = await queryDatabase(query, values);

    if (duplicateCheckResult.length > 0) {
      res.status(400).send({ message: msj.duplicatedEntry });
    } else {
      // Actualizar los campos específicos
      const { query, values }  = await updateDeviceClient(id, idclient, idevice, idautor);
      const updateResult = await queryDatabase(query, values);

      if (updateResult.affectedRows === 1) {
        res.status(200).send({ message: msj.successPut });
      } else {
        res.status(500).send({ message: msj.errorQuery });
      }
    }
  } catch (err) {
    console.log(err);
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
  }catch (err) {
    console.log(err)
    res.status(500).send({ message: msj.errorQuery });
  }
});

module.exports = router;
