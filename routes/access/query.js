const { queryDatabase } = require("../../services/db/query");

async function insertPermission(idrol, idcomponent, create, edit, delet, ver, autor) {
    const duplicateQuery = "SELECT * FROM rol_access WHERE idrol = ? AND idcomponent = ?";
    try {
        const duplicateResults = await queryDatabase(duplicateQuery, [idrol, idcomponent]);
        if (duplicateResults.length > 0) {
            throw new Error("Ya existe un registro con la misma combinación de Rol y component");
        }

        const insertQuery = "INSERT INTO rol_access (idrol, idcomponent, create, edit, delet, ver, idautor) VALUES (?,?,?,?,?,?,?);";
        const values = [idrol, idcomponent, create, edit, delet, ver, autor];
        await queryDatabase(insertQuery, values);
    } catch (error) {
        console.error("Error al insertar el permiso:", error);
        throw new Error("Error al insertar el permiso");
    }
}

async function getPermissionsByRoleId(id) {
    const query = "SELECT rr.rol as rol, c.name as component, r.* FROM rol_access r JOIN component c ON r.idcomponent = c.id JOIN rol rr ON rr.id = r.idrol WHERE rr.id = ?";
    try {
        const results = await queryDatabase(query, [id]);
        return results;
    } catch (error) {
        console.error("Error al obtener los permisos por ID de Rol:", error);
        throw new Error("Error al obtener los permisos por ID de Rol");
    }
}

async function getPermissionById(id) {
    const query = "SELECT * FROM rol_access WHERE id = ?";
    try {
        const results = await queryDatabase(query, [id]);
        return results;
    } catch (error) {
        console.error("Error al obtener el permiso por ID:", error);
        throw new Error("Error al obtener el permiso por ID");
    }
}

async function getRolByUser(id) {
    const query = "SELECT r.id FROM rol r JOIN user_rol ur ON r.id = ur.idrol WHERE ur.iduser = ?";
    try {
        const results = await queryDatabase(query, [id]);
        return results;
    } catch (error) {
        console.error("Error al obtener los permisos del Usuario:", error);
        throw new Error("Error al obtener los permisos por ID de Usuario");
    }
}

async function getPermissionsByUserId(id) {
    const query = "SELECT idcomponent, creat, edit, delet, watch FROM rol_access WHERE idrol = ?";
    try {
        const results = await queryDatabase(query, [id]);
        return results;
    } catch (error) {
        console.error("Error al obtener los permisos por ID de Usuario:", error);
        throw new Error("Error al obtener los permisos por ID de Usuario");
    }
}

async function updatePermission(id, idrol, idcomponent, create, edit, delet, ver) {
    const duplicateQuery = "SELECT * FROM rol_access WHERE idrol = ? AND idcomponent = ? AND id <> ?";
    try {
        const duplicateResults = await queryDatabase(duplicateQuery, [idrol, idcomponent, id]);
        if (duplicateResults.length > 0) {
            throw new Error("Ya existe un registro con el mismo Rol y component");
        }

        const fieldsToUpdate = {
            createUpd: new Date(),
        };
        if (idrol) fieldsToUpdate.idrol = idrol;
        if (idcomponent) fieldsToUpdate.idcomponent = idcomponent;
        if (create !== undefined) fieldsToUpdate.create = create;
        if (edit !== undefined) fieldsToUpdate.edit = edit;
        if (delet !== undefined) fieldsToUpdate.delet = delet;
        if (ver !== undefined) fieldsToUpdate.ver = ver;

        const updateQuery = "UPDATE rol_access SET ? WHERE id = ?";
        await queryDatabase(updateQuery, [fieldsToUpdate, id]);
    } catch (error) {
        console.error("Error al actualizar el permiso:", error);
        throw new Error("Error al actualizar el permiso");
    }
}

async function deletePermission(id) {
    const query = "DELETE FROM rol_access WHERE id = ?";
    try {
        await queryDatabase(query, [id]);
    } catch (error) {
        console.error("Error al delet el permiso:", error);
        throw new Error("Error al delet el permiso");
    }
}

module.exports = {
    insertPermission,
    getPermissionsByRoleId,
    getRolByUser,
    getPermissionById,
    getPermissionsByUserId,
    updatePermission,
    deletePermission,
};
