function getUnusedDeviceIdentities() {
  return `
    SELECT de.id, de.name  FROM device de
    LEFT JOIN device_client c ON de.id = c.idevice
     WHERE c.idevice IS NULL AND de.deleted = 0 AND de.status = 1`;
}

function getDevicesIdentity() {
  return `SELECT de.id, de.name FROM device de WHERE de.deleted = 0 AND de.status = 1`
}

function getTotalRecords() {
  return `SELECT COUNT(*) as totalRecords FROM device de
  LEFT JOIN device_client dc ON de.id = dc.idevice
  LEFT JOIN client cl ON dc.idclient = cl.id
  LEFT JOIN person pe ON cl.idperson = pe.id
  LEFT JOIN location l ON de.idlocation = l.id
  LEFT JOIN community c ON l.idcommunity = c.id
  LEFT JOIN municipality m ON c.idmunicipality = m.id
  LEFT JOIN province p ON m.idprovince = p.id
  LEFT JOIN department d ON p.iddepartment = d.id WHERE de.deleted = 0`;
}

function getLazy(startIndex, numRows, globalFilter, sortField, sortOrder) {
  let query = `SELECT de.id, de.name as "code", COALESCE( CONCAT_WS(' ', pe.name, pe.lastname), 'Vacio') AS "client", COALESCE(pe.ci, 'Vacio') AS "ci", d.name AS "department", c.name AS "community", l.name AS "location", de.status, de.createdAt, de.createdUpd FROM device de
  LEFT JOIN device_client dc ON de.id = dc.idevice
  LEFT JOIN client cl ON dc.idclient = cl.id
  LEFT JOIN person pe ON cl.idperson = pe.id
  LEFT JOIN location l ON de.idlocation = l.id
  LEFT JOIN community c ON l.idcommunity = c.id
  LEFT JOIN municipality m ON c.idmunicipality = m.id
  LEFT JOIN province p ON m.idprovince = p.id
  LEFT JOIN department d ON p.iddepartment = d.id WHERE de.deleted = 0 AND l.deleted = 0 AND c.deleted = 0 AND m.deleted = 0 AND p.deleted = 0 AND d.deleted = 0`;

  if (globalFilter) {
    query += ` AND (c.name LIKE '%${globalFilter}%' OR l.name LIKE '%${globalFilter}%' OR d.name LIKE '%${globalFilter}%' OR de.name LIKE '%${globalFilter}%' OR pe.lastname LIKE '%${globalFilter}%' OR pe.name LIKE '%${globalFilter}%' OR pe.ci LIKE '%${globalFilter}%')`;
  }

  if (sortField && sortOrder) {
    query += ` ORDER BY ${sortField} ${sortOrder === '1' ? 'ASC' : 'DESC'}`;
  }

  query += ` LIMIT ${startIndex}, ${numRows}`;

  return query;
}

function getDeviceIdentityById(id) {
  return {
    query: `SELECT * FROM device WHERE id = ?`,
    value: [id],
  }
}

function checkExistingIdentity(name) {
  return {
      queryCheck: "SELECT * FROM device WHERE name = ? AND deleted = 0",
      valueCheck: [name],
  };
}

function checkExistingIdentityUpdate(name, id = null) {
  let queryCheck = "SELECT * FROM device WHERE name = ? ";
  const valueCheck = [name];

  if (id !== null) {
    queryCheck += " AND id <> ?";
    valueCheck.push(id);
  }

  return {
    queryCheck,
    valueCheck,
  };
}

function insertDeviceIdentity(name, idlocation, status, idautor) {
  return {
    query: `INSERT INTO device (name, idlocation, status, idautor) VALUES (?, ?, ?, ?)`,
    values: [name, idlocation, status, idautor],
  };
}

function updateDeviceIdentity(id, name, idlocation, status, idautor) {
  let query = "UPDATE device SET";
  const values = [];

  if (idlocation !== undefined) {
    query += ` idlocation = ?,`;
    values.push(idlocation);
  }

  if (name !== undefined) {
    query += ` name = ?,`;
    values.push(name);
  }

  if (status !== undefined) {
    query += ` status = ?, `;
    values.push(status);
  }

  if (idautor) {
    query += ` idautorUpd = ? `;
    values.push(idautor);
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

function deleteDeviceIdentity(id) {
  return {
    query: "UPDATE device SET deleted = 1 WHERE id = ?",
    value: [id],
  };
}

module.exports = {
  checkExistingIdentity,
  checkExistingIdentityUpdate,
  getDevicesIdentity,
  getTotalRecords,
  getLazy,
  getUnusedDeviceIdentities,
  getDeviceIdentityById,
  insertDeviceIdentity,
  updateDeviceIdentity,
  deleteDeviceIdentity,
};