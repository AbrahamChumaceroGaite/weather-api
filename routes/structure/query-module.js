const { queryDatabase } = require("../../services/db/query");

async function checkDuplicateModule(name) {
  const duplicateQuery = "SELECT * FROM module WHERE name = ?";
  try {
    const results = await queryDatabase(duplicateQuery, [name]);
    return results.length > 0;
  } catch (error) {
    console.error("Error al verificar duplicados:", error);
    throw new Error("Error al verificar duplicados");
  }
}

async function insertModule(name, authorId) {
  const insertQuery = "INSERT INTO module (name, idautor) VALUES (?, ?)";
  const values = [name, authorId];
  try {
    await queryDatabase(insertQuery, values);
  } catch (error) {
    console.error("Error al insertar el registro:", error);
    throw new Error("Error al insertar el registro");
  }
}

async function getModules() {
  const query = "SELECT * FROM module WHERE deleted = 1 ORDER BY name";
  try {
    const results = await queryDatabase(query);
    return results;
  } catch (error) {
    console.error("Error al obtener módulos:", error);
    throw new Error("Error al obtener módulos");
  }
}

async function getModuleById(id) {
    const query = "SELECT * FROM module WHERE id = ? AND deleted = 1";
    try {
      const results = await queryDatabase(query, [id]);
      return results;
    } catch (error) {
      console.error("Error al obtener el módulo por ID:", error);
      throw new Error("Error al obtener el módulo por ID");
    }
  }
  
  async function updateModule(id, name) {
    const duplicateQuery = "SELECT * FROM module WHERE name = ? AND id != ?";
    try {
      const duplicateResults = await queryDatabase(duplicateQuery, [name, id]);
      if (duplicateResults.length > 0) {
        throw new Error("Ya existe otro módulo con el mismo name");
      }
  
      const updateQuery = "UPDATE module SET name = ?, createUpd = NOW() WHERE id = ?";
      await queryDatabase(updateQuery, [name, id]);
    } catch (error) {
      console.error("Error al actualizar el módulo:", error);
      throw new Error("Error al actualizar el módulo");
    }
  }
  
  async function deleteModule(id) {
    const query = "UPDATE module SET deleted = 0 WHERE id = ?";
    try {
      await queryDatabase(query, [id]);
    } catch (error) {
      console.error("Error al eliminar el módulo:", error);
      throw new Error("Error al eliminar el módulo");
    }
  }

module.exports = {
  checkDuplicateModule,
  insertModule,
  getModules,
  getModuleById,
  updateModule,
  deleteModule,
};
