const express = require("express");
const router = express.Router();
const msj = require("../../utils/messages");
const { queryDatabase } = require("../../services/db/query");
const { getRoles, postRole, updateRole, deleteRole, checkDuplicateRole } = require("./query");

// Endpoint para obtener roles
router.get("/get", async (req, res) => {
  try {
    const results = await queryDatabase(getRoles());
    res.send(results);
  } catch (err) {
    res.status(500).send({ message: msj.errorQuery });
  }
});

// Endpoint para crear un rol
router.post("/post", async (req, res) => {
  const rol = req.body.rol;

  try {
    // Verificar duplicados
    const duplicateCheck = await queryDatabase(checkDuplicateRole(rol, null));
    if (duplicateCheck.length > 0) {
      res.status(400).send({ message: msj.duplicatedRole });
    } else {
      const results = await queryDatabase(postRole(rol));
      res.send(results);
    }
  } catch (err) {
    res.status(500).send({ message: msj.errorQuery });
  }
});

// Endpoint para actualizar un rol
router.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  const rol = req.body.rol;

  try {
    // Verificar duplicados, excluyendo el propio ID
    const duplicateCheck = await queryDatabase(checkDuplicateRole(rol, id));
    if (duplicateCheck.length > 0) {
      res.status(400).send({ message: msj.duplicatedRole });
    } else {
      const results = await queryDatabase(updateRole(id, rol));
      res.send(results);
    }
  } catch (err) {
    res.status(500).send({ message: msj.errorQuery });
  }
});

// Endpoint para eliminar un rol
router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const results = await queryDatabase(deleteRole(id));
    res.send(results);
  } catch (err) {
    res.status(500).send({ message: msj.errorQuery });
  }
});



module.exports = router;