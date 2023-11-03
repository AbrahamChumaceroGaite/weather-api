function getLocations() {
    return `
      SELECT l.* FROM location l WHERE l.deleted = 0`
}

function getTotalRecords(id) {
    return {
        query: `SELECT COUNT(*) as totalRecords FROM location l
        JOIN community c on l.idcommunity = c.id
        JOIN municipality m on c.idmunicipality = m.id
        JOIN province p on m.idprovince = p.id
        JOIN department d on p.iddepartment = d.id
        WHERE d.id = ? AND c.deleted = 0`,
        values: [id],
    }
}

function getLazy(id, startIndex, numRows, globalFilter, sortField, sortOrder) {
    let query = ` SELECT
    l.id,
    d.name as "department",
    p.name as "province",
    m.name as "municipality",
    c.name as "community",
    l.name,
    l.createdAt,
    l.createdUpd
  FROM location l
  JOIN community c on l.idcommunity = c.id
  JOIN municipality m on c.idmunicipality = m.id
  JOIN province p on m.idprovince = p.id
  JOIN department d on p.iddepartment = d.id
  WHERE d.id = ${id} AND l.deleted = 0`;

    if (globalFilter) {
        query += ` AND (d.name LIKE '%${globalFilter}%' OR p.name LIKE '%${globalFilter}%' OR m.name LIKE '%${globalFilter}%' OR c.name LIKE '%${globalFilter}%' OR l.name LIKE '%${globalFilter}%')`;  }

    if (sortField && sortOrder) {
        query += ` ORDER BY ${sortField} ${sortOrder === '1' ? 'ASC' : 'DESC'}`;
    }

    query += ` LIMIT ${startIndex}, ${numRows}`;

    return query;
}

function getLocationById(id) {
    return {
        query: `
        SELECT * FROM location
        WHERE id = ?
      `,
        value: [id],
    };
}

function insertLocation(idcommunity, name) {
    return {
        query: `
        INSERT INTO location (idcommunity, name)
        VALUES (?, ?)
      `,
        values: [idcommunity, name],
    };
}

function updateLocation(id, name, idcommunity) {
    let query = "UPDATE location SET";
    const values = [];

    if (name) {
        query += " name = ?,";
        values.push(name);
    }

    if (idcommunity) {
        query += " idcommunity = ?,";
        values.push(idcommunity);
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

function checkDuplicateLocation(name, idcommunity, id = null) {
    let query = "SELECT * FROM location WHERE name = ? AND idcommunity = ?";
    const values = [name, idcommunity];

    if (id !== null) {
        query += " AND id <> ?";
        values.push(id);
    }

    return {
        query,
        values,
    };
}

function deleteLocation(id) {
    return {
        query: "UPDATE location SET deleted = 1 WHERE id = ?",
        value: [id],
    };
}

module.exports = {
    getLocations,
    getLocationById,
    getLazy,
    getTotalRecords,
    insertLocation,
    updateLocation,
    checkDuplicateLocation,
    deleteLocation
}
