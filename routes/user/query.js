function getUsers() {
    return `SELECT ur.id, CONCAT_WS(' ', p.name, p.lastname) as user, FROM user_rol ur   
    JOIN user u ON ur.iduser = u.id
    JOIN person p ON u.idperson = p.id
    WHERE ur.deleted = 0`;
}

function getTotalRecords(id) {
    return `SELECT COUNT(*) as totalRecords FROM user_rol ur
    JOIN user u ON ur.iduser = u.id
    JOIN rol r ON ur.idrol = r.id
    JOIN person p ON u.idperson = p.id
    WHERE ur.idrol = ${id} AND ur.deleted = 0`;
}

function getLazy(id, startIndex, numRows, globalFilter, sortField, sortOrder) {
    let query = `SELECT ur.id, CONCAT_WS(' ', p.name, p.lastname) as user, ur.createdAt, r.rol, ur.createdUpd FROM user_rol ur
    JOIN user u ON ur.iduser = u.id
    JOIN rol r ON ur.idrol = r.id
    JOIN person p ON u.idperson = p.id
    WHERE ur.idrol = ${id} AND ur.deleted = 0`;

    if (globalFilter) {
        query += ` AND (p.lastname LIKE '%${globalFilter}%' OR p.name LIKE '%${globalFilter}%')`;
    }

    if (sortField && sortOrder) {
        query += ` ORDER BY ${sortField} ${sortOrder === '1' ? 'ASC' : 'DESC'}`;
    }

    query += ` LIMIT ${startIndex}, ${numRows}`;

    return query;
}

function getUserById(id) {
    return `SELECT p.id as idperson, CONCAT_WS(' ', p.name, p.lastname) as user, r.id as idrol FROM user u
    JOIN person p ON u.idperson = p.id
    JOIN user_rol ur ON u.id = ur.iduser
    JOIN rol r ON ur.idrol = r.id
    WHERE ur.id = ${id} AND u.deleted = 0`;
}

function insertUser(idperson, idautor) {
    return {
        query: "INSERT INTO user (idperson, idautor) VALUES (?, ?)",
        values: [idperson, idautor],
    };
}

function insertUserRol(iduser, idrol, pass, idautor) {
    return {
        query: "INSERT INTO user_rol (iduser, idrol, pass, idautor) VALUES (?, ?, ?, ?)",
        values: [iduser, idrol, pass, idautor],
    };
}

function updateUser(id, idperson, idautor) {
    let query = "UPDATE user SET";
    const values = [];

    if (idperson) {
        query += " idperson = ?, ";
        values.push(idperson);
    }

    if (idautor !== undefined) {
        query += "idautorUpd = ? ";
        values.push(idautor);
    }

    query = query.slice(0, -1);
    query += " WHERE id = ?";
    values.push(id);

    return {
        query,
        values,
    };
}

function updateUserRol(id, iduser, idrol, pass, idautor) {
    let query = "UPDATE user_rol SET";
    const values = [];

    if (idrol) {
        query += " idrol = ?, ";
        values.push(idrol);
    }
    if (pass) {
        query += " pass = ?, ";
        values.push(pass);
    }

    if (idautor !== undefined) {
        query += "idautorUpd = ? ";
        values.push(idautor);
    }

    query = query.slice(0, -1);
    query += " WHERE id = ?";
    values.push(id);

    return {
        query,
        values,
    };
}

function deleteUser(id) {
    return {
        query: "UPDATE user SET deleted = 1 WHERE id = ?",
        values: [id]
    };
}

function checkDuplicateUser(idperson) {
    return {
        query: "SELECT * FROM user WHERE idperson = ?",
        values: [idperson]
    };
}

function checkDuplicateUserRol(iduser, idrol) {
    return {
        query: "SELECT * FROM user_rol WHERE iduser = ? AND idrol = ?",
        values: [iduser, idrol]
    };
}

function checkDuplicateUserRolUpdate(iduser, id = null) {
    let query = "SELECT * FROM user_rol WHERE iduser = ?";
    const values = [iduser];

    if (id !== null) {
        query += " AND id <> ?";
        values.push(id);
    }

    return {
        query,
        values,
    };
}

function checkDuplicateUserUpdate(idperson, id = null) {
    let query = "SELECT * FROM user WHERE idperson = ? ";
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
    getUsers,
    getUserById,
    getTotalRecords,
    getLazy,
    insertUser,
    insertUserRol,
    updateUser,
    updateUserRol,
    deleteUser,
    checkDuplicateUser,
    checkDuplicateUserUpdate,
    checkDuplicateUserRol,
    checkDuplicateUserRolUpdate
};