const express = require("express");
const router = express.Router();
const { queryDatabase } = require("../../services/db/query");
const msj = require("../../templates/messages");
const { getProvinces, getProvinceById, getByDept, getLazy, getTotalRecords, insertProvince, checkDuplicateProvince, updateProvince, deleteProvince } = require("./query");

router.get("/get", async (req, res) => {
  try {
    const query = getProvinces();
    const results = await queryDatabase(query);
    if (results.length > 0) {
      res.send(results);
    } else {
      res.status(404).send({ message: msj.notFound });
    }
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
    const totalR = await queryDatabase(getTotalRecords(id));
    const total = totalR[0].totalRecords;

    if (total.length === 0) {
      res.status(404).send({ message: msj.emptyQuery });
    } else {
      res.send({ items: communities, totalRecords: total });
    }
  }catch (err) {
    console.log(err)
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.get("/getById/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const providenceQuery = getProvinceById(id);
    const results = await queryDatabase(providenceQuery.query, providenceQuery.values);
    if (results.length > 0) {
      res.send(results);
    } else {
      res.status(404).send({ message: msj.notFound });
    }
  }catch (err) {
    console.log(err)
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.get("/getByDept/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const providenceQuery = await getByDept(id);
    const results = await queryDatabase(providenceQuery.query, providenceQuery.values);
    if (results.length > 0) {
      res.send(results);
    } else {
      res.status(404).send({ message: msj.notFound });
    }
  }catch (err) {
    console.log(err)
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.post("/post", async (req, res) => {
  const { iddepartment, name, idautor } = req.body;

  try {
    const duplicateCheckQuery = checkDuplicateProvince(name, iddepartment);
    const duplicateCheckResult = await queryDatabase(duplicateCheckQuery.query, duplicateCheckQuery.values);

    if (duplicateCheckResult.length > 0) {
      res.status(400).send({ message: msj.duplicatedProvince });
    } else {
      const insertQuery = insertProvince(iddepartment, name, idautor);
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
  const { name, iddepartment, idautor } = req.body;

  try {
    const duplicateCheckQuery = await checkDuplicateProvince(name, iddepartment, id);
    const duplicateCheckResult = await queryDatabase(duplicateCheckQuery.query, duplicateCheckQuery.values);

    if (duplicateCheckResult.length > 0) {
      res.status(400).send({ message: msj.duplicatedProvince });
      return;
    }

    const updateQuery = updateProvince(id, name, iddepartment, idautor);
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
    const deleteQuery = deleteProvince(id);
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