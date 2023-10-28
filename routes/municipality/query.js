function getMunicipalities() {
  return `
      SELECT m.id, d.name as "department", p.name as "province", m.name, p.createdAt
      FROM municipality m
      JOIN province p ON m.idprovince = p.id
      JOIN department d ON p.iddepartment = d.id
      WHERE m.deleted = 0
    `;
}

function getMunicipalityById(id) {
  return {
    query: "SELECT * FROM municipality WHERE id = ?",
    value: [id],
  };
}

function checkDuplicateMunicipality(name, idprovince, id = null) {
  let query = "SELECT * FROM municipality WHERE name = ? AND idprovince = ?";
  const values = [name, idprovince];

  if (id !== null) {
    query += " AND id <> ?";
    values.push(id);
  }

  return {
    query,
    values,
  };
}

function insertMunicipality(idprovince, name) {
  return {
    query: "INSERT INTO municipality (idprovince, name, deleted) VALUES (?, ?, 0)",
    values: [idprovince, name],
  };
}

function updateMunicipality(id, name, idprovince) {
  let query = "UPDATE municipality SET";
  const values = [];

  if (name !== undefined) {
    query += " name = ?,";
    values.push(name);
  }

  if (idprovince !== undefined) {
    query += " idprovince = ?,";
    values.push(idprovince);
  }

  // Elimina la coma final y agrega la condición WHERE
  query = query.slice(0, -1);
  query += " WHERE id = ?";
  values.push(id);

  return {
    query,
    values,
  };
}

function deleteMunicipality(id) {
  return {
    query: "UPDATE municipality SET deleted = 1 WHERE id = ?",
    value: [id],
  }
}

module.exports = {
  getMunicipalities,
  getMunicipalityById,
  checkDuplicateMunicipality,
  insertMunicipality,
  updateMunicipality,
  deleteMunicipality
};