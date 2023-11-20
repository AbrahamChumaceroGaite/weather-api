const { queryDatabase } = require("../../services/db/query");

async function insertComponent(idmodule, name, autor) {
  const duplicateQuery = "SELECT * FROM component WHERE idmodule = ? AND name = ?";
  try {
    const duplicateResults = await queryDatabase(duplicateQuery, [idmodule, name]);
    if (duplicateResults.length > 0) {
      throw new Error("Ya existe un component con el mismo idmodule y name");
    }

    const insertQuery = "INSERT INTO component (idmodule, name, idautor) VALUES (?, ?, ?)";
    await queryDatabase(insertQuery, [idmodule, name, autor]);
  } catch (error) {
    console.error("Error al registrar el component:", error);
    throw new Error("Error al registrar el component");
  }
}

async function getComponentsByModuleId(id) {
  const query = "SELECT m.name as module, c.* FROM component c JOIN module m ON m.id = c.idmodule WHERE c.deleted = 1 AND m.id = ? ORDER BY c.name";
  try {
    const results = await queryDatabase(query, [id]);
    return results;
  } catch (error) {
    console.error("Error al obtener los components por ID de módulo:", error);
    throw new Error("Error al obtener los components por ID de módulo");
  }
}

async function getAvailableComponents(id) {
  const query = `SELECT c.id, c.name
    FROM component c
    WHERE c.id NOT IN (
        SELECT rp.idcomponent
        FROM rol_access rp
        WHERE rp.idrol = ?
    ) ORDER BY c.name;`;
  try {
    const results = await queryDatabase(query, [id]);
    return results;
  } catch (error) {
    console.error("Error al obtener los components deleteds:", error);
    throw new Error("Error al obtener los components deleteds");
  }
}

async function getComponentById(id) {
    const query = "SELECT * FROM component WHERE id = ? AND deleted = 1";
    try {
      const results = await queryDatabase(query, [id]);
      return results;
    } catch (error) {
      console.error("Error al obtener el component por ID:", error);
      throw new Error("Error al obtener el component por ID");
    }
  }
  
  async function updateComponent(id, idmodule, name) {
    const query = "UPDATE component SET idmodule = ?, name = ?, createUpd = NOW() WHERE id = ?";
    try {
      await queryDatabase(query, [idmodule, name, id]);
    } catch (error) {
      console.error("Error al actualizar el component:", error);
      throw new Error("Error al actualizar el component");
    }
  }
  
  async function deleteComponent(id) {
    const query = "UPDATE component SET deleted = 0 WHERE id = ?";
    try {
      await queryDatabase(query, [id]);
    } catch (error) {
      console.error("Error al eliminar el component:", error);
      throw new Error("Error al eliminar el component");
    }
  }

module.exports = {
  insertComponent,
  getComponentsByModuleId,
  getAvailableComponents,
  getComponentById,
  updateComponent,
  deleteComponent,
};
