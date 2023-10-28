function getLocations() {
    return `
      SELECT
        l.id,
        d.name as "department",
        p.name as "province",
        m.name as "municipality",
        c.name as "community",
        l.name,
        l.createdAt
      FROM location l
      JOIN community c on l.idcommunity = c.id
      JOIN municipality m on c.idmunicipality = m.id
      JOIN province p on m.idprovince = p.id
      JOIN department d on p.iddepartment = d.id
      WHERE c.deleted = 0
    `;
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
    insertLocation,
    updateLocation,
    checkDuplicateLocation,
    deleteLocation
}
