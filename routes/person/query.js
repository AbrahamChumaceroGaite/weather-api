function getPerson() {
    return "SELECT p.* FROM person p WHERE p.deleted = 0";
}

function getTotalRecords() {
    return `SELECT COUNT(*) as totalRecords FROM person WHERE deleted = 0`;
}

function getLazy(startIndex, numRows, globalFilter, sortField, sortOrder) {
    let query = `SELECT p.*, l.name AS "locacion" FROM person p JOIN location l ON p.idlocation = l.id WHERE p.deleted = 0`;

    if (globalFilter) {
        query += ` AND (p.lastname LIKE '%${globalFilter}%' OR p.name LIKE '%${globalFilter}%')`;
    }

    if (sortField && sortOrder) {
        query += ` ORDER BY ${sortField} ${sortOrder === '1' ? 'ASC' : 'DESC'}`;
    }

    query += ` LIMIT ${startIndex}, ${numRows}`;

    return query;
}

function getPersonById(id) {
    return {
        query: "SELECT * FROM person WHERE id = ?",
        values: [id],
    };
}

function insertPerson(idlocation, name, lastname, ci, phone, email) {
    return {
        query: "INSERT INTO person (idlocation, name, lastname, ci, phone, email) VALUES (?, ?, ?, ?, ?, ?)",
        values: [idlocation, name, lastname, ci, phone, email],
    };
}

function updatePerson(id, idlocation, name, lastname, ci, phone, email) {
    let query = "UPDATE person SET";
    const values = [];

    if (idlocation) {
        query += " idlocation = ?,";
        values.push(idlocation);
    }
    if (name) {
        query += " name = ?,";
        values.push(name);
    }
    if (lastname) {
        query += " lastname = ?,";
        values.push(lastname);
    }
    if (ci) {
        query += " ci = ?,";
        values.push(ci);
    }
    if (phone) {
        query += " phone = ?,";
        values.push(phone);
    }
    if (email) {
        query += " email = ?,";
        values.push(email);
    }

    // Remove the trailing comma and add the WHERE condition
    query = query.slice(0, -1);
    query += " WHERE id = ?";
    values.push(id);

    return {
        query,
        values,
    };
}

function deletePerson(id) {
    return {
        query: "UPDATE person SET deleted = 1 WHERE id = ?",
        values: [id]
    };
}

function checkDuplicatePerson(ci, phone, email) {
    let query = "SELECT * FROM person WHERE (ci = ? OR phone = ? OR email = ?)";
    const values = [ci, phone, email];

    return {
        query,
        values,
    };
}

function checkDuplicatePersonUpdate(ci, phone, email, id = null) {
    let query = "SELECT * FROM person WHERE ( ";
    const values = [];

    if (ci) {
        query += "ci = ? OR ";
        values.push(ci);
    }
    if (phone) {
        query += "phone = ? OR ";
        values.push(phone);
    }
    if (email) {
        query += "email = ? ";
        values.push(email);
    }

    if (id !== null) {
        query += ") AND id <> ?";
        values.push(id);
    }

    return {
        query,
        values,
    };
}

module.exports = {
    getPerson,
    getTotalRecords,
    getLazy,
    getPersonById,
    insertPerson,
    updatePerson,
    deletePerson,
    checkDuplicatePerson,
    checkDuplicatePersonUpdate
};