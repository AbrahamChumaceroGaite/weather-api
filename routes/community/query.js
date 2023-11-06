function getCommunities() {
    return `
      SELECT c.id, d.name as "department", p.name as "province", m.name as "municipality", c.name, c.createdAt
      FROM community c
      JOIN municipality m ON c.idmunicipality = m.id
      JOIN province p ON m.idprovince = p.id
      JOIN department d ON p.iddepartment = d.id
      WHERE c.deleted = 0
    `;
}

function getByDept(id) {
    return {
      query: `SELECT c.* FROM community c
      JOIN municipality m ON c.idmunicipality = m.id
      JOIN province p ON m.idprovince = p.id
      JOIN department d ON p.iddepartment = d.id
      WHERE d.id = ? AND c.deleted = 0`,
      values: [id]
    };
  }

function getTotalRecords(id) {
    return `SELECT COUNT(*) as totalRecords FROM community c
    JOIN municipality m ON c.idmunicipality = m.id
    JOIN province p ON m.idprovince = p.id
    JOIN department d ON p.iddepartment = d.id
    WHERE d.id = ${id} AND c.deleted = 0`;
}

function getLazy(id, startIndex, numRows, globalFilter, sortField, sortOrder) {
    let query = `SELECT c.id, p.name as "province", m.name as "municipality", c.name, c.createdAt, c.createdUpd
    FROM community c
    JOIN municipality m ON c.idmunicipality = m.id
    JOIN province p ON m.idprovince = p.id
    JOIN department d ON p.iddepartment = d.id
    WHERE d.id = ${id} AND c.deleted = 0`;

    if (globalFilter) {
        query += ` AND (d.name LIKE '%${globalFilter}%' OR p.name LIKE '%${globalFilter}%' OR m.name LIKE '%${globalFilter}%' OR c.name LIKE '%${globalFilter}%')`;
    }

    if (sortField && sortOrder) {
        query += ` ORDER BY ${sortField} ${sortOrder === '1' ? 'ASC' : 'DESC'}`;
    }

    query += ` LIMIT ${startIndex}, ${numRows}`;

    return query;
}

function getCommunityById(id) {
    return {
        query: "SELECT * FROM community WHERE id = ?",
        value: [id],
    };
}

function postCommunity(name, idmunicipality, idautor) {
    return {
        query: "INSERT INTO community (idmunicipality, name, idautor) VALUES (?, ?, ?)",
        value: [idmunicipality, name, idautor],
    };
}

function checkExistingCommunity(name, idmunicipality) {
    return {
        query: "SELECT * FROM community c WHERE c.name = ? AND c.deleted = 0",
        value: [name, idmunicipality],
    };
}

function checkExistingCommunityUpdate(name, idmunicipality, id = null) {
    let query = "SELECT * FROM community WHERE name = ? AND idmunicipality = ?";
    const values = [name, idmunicipality];

    if (id !== null) {
        query += " AND id <> ?";
        values.push(id);
    }

    return {
        query,
        values,
    };
}

function updateCommunity(id, name, idmunicipality, idautor) {
    let query = "UPDATE community SET";
    const value = [];

    if (name) {
        query += ` name = ?,`;
        value.push(name);
    }
    if (idmunicipality) {
        query += ` idmunicipality = ?,`;
        value.push(idmunicipality);
    }

    if (idautor !== undefined) {
        query += "idautorUpd = ? ";
        values.push(idautor);
    }

    // Elimina la coma final y agrega la condición WHERE
    query = query.slice(0, -1);
    query += ` WHERE id = ?`;
    value.push(id);

    return {
        query,
        value,
    };
}

function deleteCommunity(id) {
    return {
        query: "UPDATE community SET deleted = 1 WHERE id = ?",
        value: [id],
    };
}

module.exports = {
    getCommunities,
    getCommunityById,
    getByDept,
    getLazy,
    getTotalRecords,
    postCommunity,
    checkExistingCommunity,
    checkExistingCommunityUpdate,
    updateCommunity,
    deleteCommunity
};
