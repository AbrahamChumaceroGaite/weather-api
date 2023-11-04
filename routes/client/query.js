function getClients() {
    return `SELECT c.id, p.name AS "client" FROM client c JOIN person p ON c.idperson = p.id WHERE c.deleted = 0`;
}

function getTotalRecords() {
    return `SELECT COUNT(*) as totalRecords FROM client WHERE deleted = 0`;
}

function getLazy(startIndex, numRows, globalFilter, sortField, sortOrder) {
    let query = `SELECT c.id, CONCAT_WS(' ', p.name, p.lastname) as user, l.name AS "location", c.createdAt, c.createdUpd
    FROM client c
    JOIN person p ON c.idperson = p.id
    JOIN location l ON p.idlocation = l.id
    WHERE c.deleted = 0`;

    if (globalFilter) {
        query += ` AND (p.lastname LIKE '%${globalFilter}%' OR p.name LIKE '%${globalFilter}%')`;
    }

    if (sortField && sortOrder) {
        query += ` ORDER BY ${sortField} ${sortOrder === '1' ? 'ASC' : 'DESC'}`;
    }

    query += ` LIMIT ${startIndex}, ${numRows}`;

    return query;
}

function getClientById(id) {
    return `SELECT c.id, CONCAT_WS(' ', p.name, p.lastname) as user, c.createdAt, c.createdUpd
    FROM client c
    JOIN person p ON c.idperson = p.id
    WHERE c.id = ${id} AND c.deleted = 0`;
}

function insertClient(idperson) {
    return {
        query: "INSERT INTO client (idperson) VALUES (?)",
        values: [idperson],
    };
}

function updateClient(id, idperson) {
    let query = "UPDATE client SET";
    const values = [];

    if (idperson) {
        query += " idperson = ?,";
        values.push(idperson);
    }

    query = query.slice(0, -1);
    query += " WHERE id = ?";
    values.push(id);

    return {
        query,
        values,
    };
}

function deleteClient(id) {
    return {
        query: "UPDATE client SET deleted = 1 WHERE id = ?",
        values: [id]
    };
}

function checkDuplicateClient(idperson) {
    return {
        query: "SELECT * FROM client WHERE idperson = ?",
        values: [idperson]
    };
}

function checkDuplicateClientUpdate(idperson, id = null) {
    let query = "SELECT * FROM client WHERE idperson = ? ";
    const values = [idperson];

    if (id !== null) {
        query += " AND id <> ?";
        values.push(id);
    }

    return {
        query,
        values,
    };
}

module.exports = {
    getClients,
    getClientById,
    getTotalRecords,
    getLazy,
    insertClient,
    updateClient,
    deleteClient,
    checkDuplicateClient,
    checkDuplicateClientUpdate
};