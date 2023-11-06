const express = require("express");
const router = express.Router();
const { queryDatabase } = require("../../services/db/query");
const msj = require("../../templates/messages");
const { getLocations, getLocationById, getLazy, getTotalRecords, insertLocation, updateLocation, checkDuplicateLocation, deleteLocation } = require("./query");

router.get("/get", async (req, res) => {
  try {
    const query = getLocations();
    const results = await queryDatabase(query);

    res.send(results);
  }catch (err) {
    console.log(err)
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.get("/getLazy", async (req, res) => {
  const { id, first, rows, globalFilter, sortField, sortOrder } = req.query;
  const startIndex = parseInt(first);
  const numRows = parseInt(rows);
  try {
    const communitiesQuery = await getLazy(id, startIndex, numRows, globalFilter, sortField, sortOrder);
    const communities = await queryDatabase(communitiesQuery);
    const { query, values } = await getTotalRecords(id);
    const totalR = await queryDatabase(query, values);
    const total = totalR[0].totalRecords;

    if (total.length === 0) {
      res.status(404).send({ message: msj.emptyQuery });
    } else {
      res.send({ items: communities, totalRecords: total });
    }
  } catch (err) {
    console.log(err)
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
  }catch (err) {
    console.log(err)
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.post("/post", async (req, res) => {
  const { idcommunity, name, idautor } = req.body;

  try {
    const duplicateCheckQuery = checkDuplicateLocation(name, idcommunity);
    const duplicateCheckResult = await queryDatabase(duplicateCheckQuery.query, duplicateCheckQuery.values);

    if (duplicateCheckResult.length > 0) {
      res.status(400).send({ message: msj.duplicatedLocation });
    } else {
      const insertQuery = insertLocation(idcommunity, name, idautor);
      await queryDatabase(insertQuery.query, insertQuery.values);
      res.status(200).send({ message: msj.successPost });
    }
  }catch (err) {
    console.log(err)
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  const { name, idcommunity, idautor } = req.body;

  try {
    const duplicateCheckQuery = checkDuplicateLocation(name, idcommunity, id);
    const duplicateCheckResult = await queryDatabase(duplicateCheckQuery.query, duplicateCheckQuery.values);

    if (duplicateCheckResult.length > 0) {
      res.status(400).send({ message: msj.duplicatedLocation });
      return;
    }

    const updateQuery = updateLocation(id, name, idcommunity, idautor);
    await queryDatabase(updateQuery.query, updateQuery.values);
    res.status(200).send({ message: msj.successPut });
  }catch (err) {
    console.log(err)
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
  }catch (err) {
    console.log(err)
    res.status(500).send({ message: msj.errorQuery });
  }
});


module.exports = router;