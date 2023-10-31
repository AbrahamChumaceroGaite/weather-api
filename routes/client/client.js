const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { getClients, getClientById, postClient, checkExistingClient, updateClient, deleteClient } = require("./query");
const { queryDatabase } = require("../../services/db/query");
const msj = require("../../templates/messages");

router.get("/get", async (req, res) => {
  try {
    const clientsQuery = await getClients();
    const clients = await queryDatabase(clientsQuery);
    res.send(clients);
  } catch (err) {
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.get("/getById/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const { query, value } = await getClientById(id);
    const client = await queryDatabase(query, value);

    if (client.length === 0) {
      res.status(404).send({ message: msj.notFound });
    } else {
      res.send(client);
    }
  } catch (err) {
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.post("/post", async (req, res) => {
  try {
    const { name, pass, ci, idrol, idlocation, number } = req.body;

    const existingClient = await checkExistingClient(ci);

    if (existingClient.length > 0) {
      res.status(400).send({ message: msj.duplicatedCI });
    } else {

      const salt = bcrypt.genSaltSync(10);

      const hashedPassword = bcrypt.hashSync(pass, salt);

      const { query, value } = postClient(name, hashedPassword, ci, idrol, idlocation, number);

      await queryDatabase(query, value);

      res.status(200).send({ message: msj.successPost });
    }
  } catch (err) {
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  const { name, pass, ci, idlocation, number } = req.body;

  try {

    let hashedPassword = pass;
    if (pass) {
      const salt = bcrypt.genSaltSync(10);
      hashedPassword = bcrypt.hashSync(pass, salt);
    }

    const existingClients = await checkExistingClientUpdate(ci, id);

    if (existingClients.length > 0) {
      res.status(400).send({ message: msj.duplicatedCI });
    } else {
      const { query, value } = await updateClient(id, name, hashedPassword, ci, idlocation, number);

      await queryDatabase(query, value);

      res.status(200).send({ message: msj.successPut });
    }
  } catch (err) {
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const deleteQuery = await deleteClient(id);

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
