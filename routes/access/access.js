const express = require("express");
const router = express.Router();
const msj = require("../../templates/messages");
const { insertPermission, getPermissionsByRoleId, getPermissionById, getPermissionsByUserId, updatePermission, deletePermission, getRolByUser } = require("./query");

router.post("/admin/permission/access/post", async (req, res) => {
    const { idrol, idcomponent, creat, edit, delet, watch, autor } = req.body;

    try {
        await insertPermission(idrol, idcomponent, creat, edit, delet, watch, autor);
        res.json({ message: "Registrado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/admin/permission/access/get/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const permissions = await getPermissionsByRoleId(id);
        res.json(permissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/admin/permission/access/getById/:id", async (req, res) => {
    const id = req.params.id;
  
    try {
      const permission = await getPermissionById(id);
      res.json(permission);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  router.get("/admin/permission/access/getByUser/:id", async (req, res) => {
    const id = req.params.id;
  
    try {

      const rol = await getRolByUser(id);
      const rol_result = rol[0].idrol;
      const permissions = await getPermissionsByUserId(rol_result);
      res.json(permissions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  router.put("/admin/permission/access/put/:id", async (req, res) => {
    const id = req.params.id;
    const { idrol, idcomponent, create, edit, delet, watch} = req.body;
  
    try {
      await updatePermission(id, idrol, idcomponent, create, edit, delet, ver);
      res.json({ message: "Registro actualizado exitosamente" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  router.delete("/admin/permission/access/delete/:id", async (req, res) => {
    const id = req.params.id;
  
    try {
      await deletePermission(id);
      res.json({ message: "Registro eliminado exitosamente" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  module.exports = router;
