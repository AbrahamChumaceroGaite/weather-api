const express = require("express");
const router = express.Router();
const { queryDatabase } = require("../../services/db/query");
const msj = require("../../utils/messages");
const { getCommunities, getCommunityById, postCommunity, checkExistingCommunity, checkExistingCommunityUpdate, updateCommunity, deleteCommunity } = require("./query");

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

router.post("/post", async (req, res) => {
  const name = req.body.name;
  const idmunicipality = req.body.idmunicipality;

  try {
    // Verificar si la comunidad ya existe en la base de datos
    const existingCommunities = await queryDatabase(checkExistingCommunity(name, idmunicipality));

    if (existingCommunities.length > 0) {
      res.status(400).send({ message: msj.duplicatedCommunity });
    } else {
      const { query, value } = await postCommunity(name, idmunicipality);
      const result = await queryDatabase(query, value);

      if (result.affectedRows === 1) {
        res.status(201).send({ message: msj.successPost });
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
  const name = req.body.name;
  const idmunicipality = req.body.idmunicipality;

  try {
    // Verificar si la comunidad ya existe en la base de datos
    const existingCommunities = await queryDatabase(checkExistingCommunityUpdate(name, idmunicipality));

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