const express = require("express");
const router = express.Router();
const msj = require("../../templates/messages");
const { checkDuplicateModule, insertModule, getModules,getModuleById, updateModule, deleteModule } = require("./query-module");
const { getComponentById, updateComponent, deleteComponent, insertComponent, getComponentsByModuleId, getAvailableComponents } = require("./query-component");

router.post("/master/structure/module/post", async (req, res) => {
  const { name, autor } = req.body;

  try {
    const isDuplicate = await checkDuplicateModule(name);
    if (isDuplicate) {
      res.status(400).json({ message: "Ya existe otro módulo con el mismo name" });
      return;
    }

    await insertModule(name, autor);
    res.json({ message: "Registrado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/master/structure/module/get", async (req, res) => {
  try {
    const modules = await getModules();
    res.json(modules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get("/master/structure/module/getById/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const module = await getModuleById(id);
    res.json(module);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/master/structure/module/put/:id", async (req, res) => {
  const id = req.params.id;
  const { name } = req.body;

  try {
    await updateModule(id, name);
    res.json({ message: "Registro actualizado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/master/structure/module/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await deleteModule(id);
    res.json({ message: "Registro eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//components

router.post("/master/structure/component/post", async (req, res) => {
  const { idmodule, name, autor } = req.body;

  try {
    await insertComponent(idmodule, name, autor);
    res.json({ message: "Registrado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/master/structure/component/get/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const components = await getComponentsByModuleId(id);
    res.json(components);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/master/structure/component/list/get/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const availableComponents = await getAvailableComponents(id);
    res.json(availableComponents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/master/structure/component/getById/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const component = await getComponentById(id);
    res.json(component);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/master/structure/component/put/:id", async (req, res) => {
  const id = req.params.id;
  const { idmodule, name } = req.body;

  try {
    await updateComponent(id, idmodule, name);
    res.json({ message: "Registro actualizado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/master/structure/component/delete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await deleteComponent(id);
    res.json({ message: "Registro eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
