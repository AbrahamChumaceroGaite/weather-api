const express = require("express");
const router = express.Router();
const { queryDatabase } = require("../../services/db/query");
const msj = require("../../utils/messages");
const { getLocations, getLocationById, insertLocation, updateLocation, checkDuplicateLocation, deleteLocation } = require("./query");

router.get("/get", async (req, res) => {
  try {
    const query = getLocations();
    const results = await queryDatabase(query);

    res.send(results);
  } catch (err) {
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.get("/getById/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const locationQuery = getLocationById(id);
    const locationResult = await queryDatabase(locationQuery.query, locationQuery.value);

    if (locationResult.length > 0) {
      res.send(locationResult);
    } else {
      res.status(404).send({ message: msj.notFound });
    }
  } catch (err) {
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.post("/post", async (req, res) => {
  const { idcommunity, name } = req.body;

  try {
    const duplicateCheckQuery = checkDuplicateLocation(name, idcommunity);
    const duplicateCheckResult = await queryDatabase(duplicateCheckQuery.query, duplicateCheckQuery.values);

    if (duplicateCheckResult.length > 0) {
      res.status(400).send({ message: msj.duplicatedLocation });
    } else {
      const insertQuery = insertLocation(idcommunity, name);
      const results = await queryDatabase(insertQuery.query, insertQuery.values);
      res.send(results);
    }
  } catch (err) {
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  const { name, idcommunity } = req.body;

  try {
    const duplicateCheckQuery = checkDuplicateLocation(name, idcommunity, id);
    const duplicateCheckResult = await queryDatabase(duplicateCheckQuery.query, duplicateCheckQuery.values);

    if (duplicateCheckResult.length > 0) {
      res.status(400).send({ message: msj.duplicatedLocation });
      return;
    }

    const updateQuery = updateLocation(id, name, idcommunity);
    const results = await queryDatabase(updateQuery.query, updateQuery.values);
    res.send(results);
  } catch (err) {
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const deleteQuery = deleteLocation(id);
    const result = await queryDatabase(deleteQuery.query, deleteQuery.value);

    if (result.affectedRows === 0) {
      res.status(404).send({ message: msj.notFound });
    } else {
      res.status(200).send({ message: msj.successDelete });
    }
  } catch (err) {
    res.status(500).send({ message: msj.errorQuery });
  }
});


module.exports = router;