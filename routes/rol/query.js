function getRoles() {
    return "SELECT * FROM rol";
}

function postRole(rol) {
    return {
        query: "INSERT INTO rol (rol) VALUES (?)",
        values: [rol]
    };
}

function updateRole(id, rol) {
    return {
        query: "UPDATE rol SET rol = ? WHERE id = ?",
        values: [rol, id]
    };
}

function deleteRole(id) {
    return {
        query: "UPDATE rol SET deleted = 1 WHERE id = ?",
        values: [id]
    };
}

function checkDuplicateRole(rol, id) {
    return {
        query: "SELECT * FROM rol WHERE rol = ? AND id <> ?",
        values: [rol, id]
    };
}

module.exports = {
    getRoles,
    postRole,
    updateRole,
    deleteRole,
    checkDuplicateRole,
};
