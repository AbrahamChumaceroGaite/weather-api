const express = require("express");
const router = express.Router();
const msj = require("../../templates/messages");
const { queryDatabase } = require("../../services/db/query");
const { getClients, getClientById, getLazy, getTotalRecords, insertClient, updateClient, deleteClient, checkDuplicateClient, checkDuplicateClientUpdate } = require("./query");

router.get("/get", async (req, res) => {
  try {
    const results = await queryDatabase(getClients())
    res.send(results);
  } catch (err) {
    console.log(err)
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.get("/getLazy", async (req, res) => {
  const { first, rows, globalFilter, sortField, sortOrder } = req.query;
  const startIndex = parseInt(first);
  const numRows = parseInt(rows);
  try {
    const personQuery = await getLazy( startIndex, numRows, globalFilter, sortField, sortOrder);
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

router.get("/getById/:id", async (req, res) => {
  const id = req.query.id;
  try {
    const results = await queryDatabase(getClientById(id))
    res.send(results);
  }catch (err) {
    console.log(err)
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.post("/post", async (req, res) => {
  const { idperson, idautor } = req.body;
  console.log(req.body)
  try {
    const duplicateCheckQuery = await checkDuplicateClient(idperson);
    const duplicateCheckResult = await queryDatabase(duplicateCheckQuery.query, duplicateCheckQuery.values);

    if (duplicateCheckResult.length > 0) {
      res.status(400).send({ message: msj.duplicatedUser });
    } else {
      const insertQuery = await insertClient(idperson, idautor);
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
  const { idperson, idautor } = req.body;

  try {
    const duplicateCheckQuery = await checkDuplicateClientUpdate(idperson, id);
    const duplicateCheckResult = await queryDatabase(duplicateCheckQuery.query, duplicateCheckQuery.values);

    if (duplicateCheckResult.length > 0) {
      res.status(400).send({ message: msj.checkDuplicateUser });
      return;
    }

    const updateQuery = updateClient(id, idperson, idautor);
    await queryDatabase(updateQuery.query, updateQuery.values);
    res.status(200).send({ message: msj.successPut });
  } catch (err) {
    console.log(err)
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const deleteQuery = deleteClient(id);
    const result = await queryDatabase(deleteQuery.query, deleteQuery.values);

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
