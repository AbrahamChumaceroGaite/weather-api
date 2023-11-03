function getProvinces() {
  return `
      SELECT p.* FROM province p WHERE p.deleted = 0
    `;
}

function getByDept(id) {
  return {
    query: `SELECT p.* FROM province p
    JOIN department d on p.iddepartment = d.id
    WHERE d.id = ? AND p.deleted = 0`,
    values: [id]
  };
}

function getTotalRecords(id) {
  return `SELECT COUNT(*) as totalRecords FROM province p
  JOIN department d on p.iddepartment = d.id
  WHERE d.id = ${id} AND p.deleted = 0`;
}

function getLazy(id, startIndex, numRows, globalFilter, sortField, sortOrder) {
  let query = `SELECT d.name as "department", p.id, p.name, p.createdAt, p.createdUpd
  FROM province p
  JOIN department d on p.iddepartment = d.id
  WHERE d.id = ${id} AND p.deleted = 0`;

  if (globalFilter) {
    query += ` AND (d.name LIKE '%${globalFilter}%' OR p.name LIKE '%${globalFilter}%')`;
  }

  if (sortField && sortOrder) {
    query += ` ORDER BY ${sortField} ${sortOrder === '1' ? 'ASC' : 'DESC'}`;
  }

  query += ` LIMIT ${startIndex}, ${numRows}`;

  return query;
}

function getProvinceById(id) {
  return {
    query: `SELECT * FROM province WHERE id = ?`,
    values: [id]
  };
}

function checkDuplicateProvince(name, iddepartment, id = null) {
  let query = "SELECT * FROM province WHERE name = ? AND iddepartment = ? AND deleted = 0";
  const values = [name, iddepartment];

  if (id !== null) {
    query += " AND id <> ?";
    values.push(id);
  }

  return {
    query,
    values,
  };
}

function insertProvince(iddepartment, name) {
  return {
    query: `INSERT INTO province (iddepartment, name) VALUES (?, ?)`,
    values: [iddepartment, name],
  };
}

function updateProvince(id, name, iddepartment) {
  const values = [];
  let query = "UPDATE province SET ";

  if (name) {
    query += ` name = ?,`;
    values.push(name);
  }

  if (iddepartment) {
    query += ` iddepartment = ?,`;
    values.push(iddepartment);
  }

  // Elimina la coma final y agrega la condición WHERE
  query = query.slice(0, -1);
  query += ` WHERE id = ?`;
  values.push(id);

  return {
    query,
    values,
  };
}

function deleteProvince(id) {
  return {
    query: "UPDATE province SET deleted = 1 WHERE id = ?",
    value: [id],
  }
}

module.exports = {
  getProvinces,
  getProvinceById,
  getLazy,
  getByDept,
  getTotalRecords,
  checkDuplicateProvince,
  insertProvince,
  updateProvince,
  deleteProvince,
};