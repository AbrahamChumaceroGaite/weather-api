function getRoles() {
    return "SELECT * FROM rol WHERE deleted = 0";
}

function postRole(rol, idautor) {
    return {
        query: "INSERT INTO rol (rol, idautor) VALUES (?, ?)",
        values: [rol, idautor]
    };
}

function updateRole(id, rol, idautor) {
    let query = "UPDATE rol SET";
    const values = [];

    if (rol) {
        query += " rol = ?, ";
        values.push(rol);
    }

   if (idautor !== undefined) {
        query += "idautorUpd = ? ";
        values.push(idautor);
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

function deleteRole(id) {
    return {
        query: "UPDATE rol SET deleted = 1 WHERE id = ?",
        values: [id]
    };
}

function checkDuplicateRole(rol) {
    return {
        query: "SELECT * FROM rol WHERE rol = ?",
        values: [rol]
    };
}

function checkDuplicateRoleUpdate(rol, id = null) {
    let query = "SELECT * FROM person WHERE ";
    const values = [];

    if (ci) {
        query += "rol = ? ";
        values.push(croli);
    }
 
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
    getRoles,
    postRole,
    updateRole,
    deleteRole,
    checkDuplicateRole,
};
