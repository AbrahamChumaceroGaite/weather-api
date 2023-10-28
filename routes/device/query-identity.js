function getUnusedDeviceIdentities() {
    return `
      SELECT de.*
      FROM device_id de
      LEFT JOIN deviceclient c ON de.id = c.idevice
      WHERE c.idevice IS NULL
        AND de.deleted = 0
        AND de.status = 1
    `;
}

function getAllDeviceIdentities() {
    return `
      SELECT de.*, lo.name AS "location", d.name AS "department"
      FROM device_id de
      JOIN location lo ON de.idlocation = lo.id
      JOIN community co ON lo.idcommunity = co.id
      JOIN municipality m ON co.idmunicipality = m.id
      JOIN province p ON m.idprovince = p.id
      JOIN department d ON p.iddepartment = d.id
      WHERE de.deleted = 0
    `;
}

function getDeviceIdentityById(id) {
    return {
        query: `SELECT *
        FROM device_id
        WHERE id = ?
      `,
        value: [id],
    }

}

function insertDeviceIdentity(name, idlocation, status) {
    return {
        query: `
        INSERT INTO device_id (name, idlocation, status)
        VALUES (?, ?, ?)
      `,
        values: [name, idlocation, status],
    };
}

function updateDeviceIdentity(id, name, idlocation, status) {
    let query = "UPDATE device_id SET";
    const values = [];
  
    if (name !== undefined) {
      query += ` name=?,`;
      values.push(name);
    }
  
    if (idlocation !== undefined) {
      query += ` idlocation=?,`;
      values.push(idlocation);
    }
  
    if (status !== undefined) {
      query += ` status=?,`;
      values.push(status);
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
        query: "UPDATE device_id SET deleted = 1 WHERE id = ?",
        value: [id],
    };
}

module.exports = {
    getUnusedDeviceIdentities,
    getAllDeviceIdentities,
    getDeviceIdentityById,
    insertDeviceIdentity,
    updateDeviceIdentity,
    deleteDeviceIdentity,
};