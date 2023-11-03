const express = require("express");
const router = express.Router();
const { queryDatabase } = require("../../services/db/query");
const msj = require("../../templates/messages");
const { getCommunities, getCommunityById, getLazy, getByDept, getTotalRecords, postCommunity, checkExistingCommunity, checkExistingCommunityUpdate, updateCommunity, deleteCommunity } = require("./query");

router.get("/get", async (req, res) => {
  try {
    const communitiesQuery = await getCommunities();
    const communities = await queryDatabase(communitiesQuery);

    if (communities.length === 0) {
      res.status(404).send({ message: msj.notFound });
    } else {
      res.send(communities);
    }
  } catch (err) {
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
  } catch (err) {
    console.log(err)
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.get("/getById/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const { query, value } = getCommunityById(id);
    const community = await queryDatabase(query, value);

    if (community.length === 0) {
      res.status(404).send({ message: msj.notFound });
    } else {
      res.send(community);
    }
  } catch (err) {
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
  } catch (err) {
    console.log(err)
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.post("/post", async (req, res) => {
  const {name, idmunicipality} = req.body;

  try {
    // Verificar si la comunidad ya existe en la base de datos
    const {query, value} = checkExistingCommunity(name, idmunicipality);
    const existingCommunities = await queryDatabase(query, value);
  
    if (existingCommunities.length > 0) {
      res.status(400).send({ message: msj.duplicatedCommunity });
    } else {
      const { query, value } = await postCommunity(name, idmunicipality);
      const result = await queryDatabase(query, value);

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

router.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  const {name, idmunicipality} = req.body;

  try {
    // Verificar si la comunidad ya existe en la base de datos
    const {query, values} = checkExistingCommunityUpdate(name, idmunicipality, id);
    const existingCommunities = await queryDatabase(query, values);

    if (existingCommunities.length > 0) {
      res.status(400).send({ message: msj.duplicatedCommunity });
    } else {
      const { query, value } = await updateCommunity(id, name, idmunicipality);
      const result = await queryDatabase(query, value);

      if (result.affectedRows === 1) {
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
    const deleteQuery = await deleteCommunity(id);
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