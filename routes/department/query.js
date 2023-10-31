function getDepartments() {
    return "SELECT * FROM department WHERE deleted = 0";
}

function getTotalUsers(id) {
    return {
        queryTU: `SELECT COUNT(*) as totalUsers FROM person p
        JOIN location l ON p.idlocation = l.id
        JOIN community c ON l.idcommunity = c.id
        JOIN municipality m ON c.idmunicipality = m.id
        JOIN province pr ON m.idprovince = pr.id
        JOIN department d ON pr.iddepartment = d.id
        WHERE d.id = ? AND p.deleted = 0`,
        valuesTU: [id],
    }
}

function getTotalRecords(id) {
    return {
        queryTR: `SELECT COUNT(*) as totalRecords FROM department d
        LEFT JOIN province p ON d.id = p.iddepartment
        LEFT JOIN municipality m ON p.id = m.idprovince
        LEFT JOIN community c ON m.id = c.idmunicipality
        LEFT JOIN location l ON c.id = l.idcommunity
        WHERE d.id = ? AND d.deleted = 0`,
        valuesTR: [id],
    }
}

function getLazy(id, startIndex, numRows, globalFilter, sortField, sortOrder) {
    let query = `SELECT d.id, d.name, COALESCE(p.name, 'Vacio') AS province, COALESCE(m.name, 'Vacio') AS municipality, COALESCE(c.name, 'Vacio') AS community, COALESCE(l.name, 'Vacio') AS location, l.createdAt, l.createdUpd
    FROM department d
    LEFT JOIN province p ON d.id = p.iddepartment
    LEFT JOIN municipality m ON p.id = m.idprovince
    LEFT JOIN community c ON m.id = c.idmunicipality
    LEFT JOIN location l ON c.id = l.idcommunity
    WHERE d.id = ${id} AND d.deleted <>1 AND l.deleted <>1 AND c.deleted <>1 AND m.deleted <>1 AND p.deleted <>1 `;

    if (globalFilter) {
        query += ` AND (d.name LIKE '%${globalFilter}%' OR p.name LIKE '%${globalFilter}%' OR m.name LIKE '%${globalFilter}%' OR c.name LIKE '%${globalFilter}%' OR l.name LIKE '%${globalFilter}%')`;
    }

    if (sortField && sortOrder) {
        query += ` ORDER BY ${sortField} ${sortOrder === '1' ? 'ASC' : 'DESC'}`;
    }

    query += ` LIMIT ${startIndex}, ${numRows}`;

    return query;
}

function getDepartmentById(id) {
    return {
        query: "SELECT * FROM department WHERE id = ?",
        value: [id],
    };
}

function postDepartment(name) {
    return {
        query: "INSERT INTO department (name) VALUES (?)",
        value: [name],
    };
}

function checkExistingDepartment(name) {
    return {
        query: "SELECT * FROM department WHERE name = ? AND deleted = 0",
        value: [name],
    };
}

function updateDepartment(id, name) {
    let query = "UPDATE department SET";
    const value = [];

    if (name) {
        query += ` name=?,`;
        value.push(name);
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

function checkExistingDepartmentUpdate(name, idmunicipality) {
    return {
        query: "SELECT * FROM client WHERE name = ? AND id <> ?",
        values: [name, idmunicipality]
    }
}

function deleteDepartment(id) {
    return {
        query: "UPDATE department SET deleted = 1 WHERE id = ?",
        value: [id],
    };
}

module.exports = {
    getDepartments,
    getLazy,
    getTotalRecords,
    getTotalUsers,
    getDepartmentById,
    postDepartment,
    checkExistingDepartment,
    checkExistingDepartmentUpdate,
    updateDepartment,
    deleteDepartment
};