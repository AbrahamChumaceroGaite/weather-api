const express = require("express");
const router = express.Router();
const { queryDatabase } = require("../../services/db/query");
const msj = require("../../templates/messages");
const { getPerson, getTotalRecords, getLazy, getPersonById, insertPerson, updatePerson, deletePerson, checkDuplicatePerson, checkDuplicatePersonUpdate } = require("./query");

router.get("/get", (req, res) => {
  queryDatabase(getPerson())
    .then((results) => {
      res.send(results);
    })
    .catch((err) => {
      res.status(500).send({ message: errorQuery });
    });
});

router.get("/getLazy", async (req, res) => {
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
  }catch (err) {
    console.log(err)
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.get("/getById/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const { query, values } = await getPersonById(id);
    const results = await queryDatabase(query, values);
    res.send(results);
  } catch (err) {
    res.status(500).send({ message: errorQuery });
  }
});

router.post("/post", async (req, res) => {
  const { idlocation, name, lastname, ci, phone, email, idautor } = req.body;

  try {
    const duplicateCheckQuery = await checkDuplicatePerson(ci, phone, email);
    const duplicateCheckResult = await queryDatabase(duplicateCheckQuery.query, duplicateCheckQuery.values);

    if (duplicateCheckResult.length > 0) {
      res.status(400).send({ message: msj.duplicatedUser });
    } else {
      const insertQuery = insertPerson(idlocation, name, lastname, ci, phone, email, idautor);
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
  const { idlocation, name, lastname, ci, phone, email, idautor } = req.body;
  try {
    const duplicateCheckQuery = checkDuplicatePersonUpdate(ci, phone, email, id);
    const duplicateCheckResult = await queryDatabase(duplicateCheckQuery.query, duplicateCheckQuery.values);

    if (duplicateCheckResult.length > 0) {
      res.status(400).send({ message: msj.duplicatedPerson });
      return;
    }

    const updateQuery = updatePerson(id, idlocation, name, lastname, ci, phone, email, idautor);
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
    const deleteQuery = deletePerson(id);
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
