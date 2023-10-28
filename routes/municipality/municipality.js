const express = require("express");
const router = express.Router();
const { queryDatabase } = require("../../services/db/query");
const msj = require("../../utils/messages");
const { getMunicipalities, getMunicipalityById, insertMunicipality, checkDuplicateMunicipality, updateMunicipality, deleteMunicipality} = require("./query");

router.get("/get", async (req, res) => {
  try {
    const query = getMunicipalities();
    const results = await queryDatabase(query);
    res.send(results);
  } catch (err) {
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.get("/getById/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const query = getMunicipalityById(id);
    const results = await queryDatabase(query.query, query.value);
    res.send(results);
  } catch (err) {
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.post("/post", async (req, res) => {
  const { idprovince, name } = req.body;

  try {
    const duplicateCheckQuery = checkDuplicateMunicipality(name, idprovince);
    const duplicateCheckResult = await queryDatabase(duplicateCheckQuery.query, duplicateCheckQuery.values);

    if (duplicateCheckResult.length > 0) {
      res.status(400).send({ message: msj.duplicatedMunicipality });
    } else {
      const insertQuery = insertMunicipality(idprovince, name);
      const results = await queryDatabase(insertQuery.query, insertQuery.values);
      res.send(results);
    }
  } catch (err) {
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  const { name, idprovince } = req.body;

  try {
    const duplicateCheckQuery = checkDuplicateMunicipality(name, idprovince, id);
    const duplicateCheckResult = await queryDatabase(duplicateCheckQuery.query, duplicateCheckQuery.values);

    if (duplicateCheckResult.length > 0) {
      res.status(400).send({ message: msj.duplicatedMunicipality });
      return;
    }

    const updateQuery = updateMunicipality(id, name, idprovince);
    const results = await queryDatabase(updateQuery.query, updateQuery.values);
    res.send(results);
  } catch (err) {
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const deleteQuery = deleteMunicipality(id);
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