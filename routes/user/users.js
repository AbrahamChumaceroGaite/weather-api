const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { queryDatabase } = require("../../services/db/query");
const { getUsers, postUser, updateUser, deleteUser, checkDuplicateUser } = require("./query");

router.get("/get", (req, res) => {
  queryDatabase(getUsers())
    .then((results) => {
      res.send(results);
    })
    .catch((err) => {
      res.status(500).send({ message: errorQuery });
    });
});

// Endpoint para obtener un usuario por ID
router.get("/getById/:id", (req, res) => {
  const id = req.params.id;
  queryDatabase(getUserById(id))
    .then((results) => {
      res.send(results);
    })
    .catch((err) => {
      res.status(500).send({ message: errorQuery });
    });
});

router.post("/post", (req, res) => {
  const { name, email, idrol, pass } = req.body;
  // Generar un salt para encriptar la contraseña
  const salt = bcrypt.genSaltSync(10);
  // Encriptar la contraseña con el salt
  const hashedPassword = bcrypt.hashSync(pass, salt);

  queryDatabase(checkDuplicateUser(email, 0))
    .then((duplicates) => {
      if (duplicates.length > 0) {
        res.status(400).send({ message: duplicatedUser });
      } else {
        const { query, values } = postUser(name, email, idrol, hashedPassword);

        queryDatabase(query, values)
          .then((results) => {
            res.status(201).send({ message: successPost, user: { id: results.insertId, name, email, idrol } });
          })
          .catch((err) => {
            res.status(500).send({ message: errorQuery });
          });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: errorQuery });
    });
});

router.put("/update/:id", (req, res) => {
  const { name, email, idrol, pass } = req.body;
  const id = req.params.id;

  queryDatabase(checkDuplicateUser(email, id))
    .then((duplicates) => {
      if (duplicates.length > 0) {
        res.status(400).send({ message: duplicatedUser });
      } else {
        // Generar un salt para encriptar la contraseña
        const salt = bcrypt.genSaltSync(10);
        // Encriptar la contraseña con el salt
        const hashedPassword = bcrypt.hashSync(pass, salt);

        const { query, values } = updateUser(id, name, email, idrol, hashedPassword);

        queryDatabase(query, values)
          .then((results) => {
            if (results.affectedRows > 0) {
              res.send({ message: successPut, user: { id, name, email, idrol } });
            } else {
              res.status(404).send({ message: notFound });
            }
          })
          .catch((err) => {
            res.status(500).send({ message: errorQuery });
          });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: errorQuery });
    });
});

router.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  queryDatabase(deleteUser(id))
    .then((results) => {
      if (results.affectedRows > 0) {
        res.send({ message: successDelete });
      } else {
        res.status(404).send({ message: notFound });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: errorQuery });
    });
});

module.exports = router;
