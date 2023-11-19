function getTotalRecords(id) {
    let query = `SELECT COUNT(*) as totalRecords FROM product p JOIN category c ON p.idcategory = c.id WHERE p.idcategory = ${id} AND p.deleted = 0`;

    return query;
}

function getLazy(id, startIndex, numRows, globalFilter, sortField, sortOrder) {
    let query = `SELECT p.*, c.name AS "category" FROM product p JOIN category c ON p.idcategory = c.id WHERE p.idcategory = ${id} AND p.deleted = 0 `;


    if (globalFilter) {
        query += ` AND (p.name LIKE '%${globalFilter}%') `;
    }

    if (sortField && sortOrder) {
        query += ` ORDER BY ${sortField} ${sortOrder === '1' ? 'ASC' : 'DESC'}`;
    }

    query += ` LIMIT ${startIndex}, ${numRows}`;

    return query;
}


module.exports = {
    getTotalRecords,
    getLazy,

};