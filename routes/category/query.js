function getTotalRecords() {
    return `SELECT COUNT(*) as totalRecords FROM category WHERE deleted = 0`;
}

function getLazy(startIndex, numRows, globalFilter, sortField, sortOrder) {
    let query = `SELECT * FROM category WHERE deleted = 0 `;
    /*     const value = [] */

    if (globalFilter) {
        query += ` WHERE (name LIKE '%${globalFilter}%') `;
    }

    if (sortField && sortOrder) {
        query += ` ORDER BY ${sortField} ${sortOrder === '1' ? 'ASC' : 'DESC'}`;
    }

    query += ` LIMIT ${startIndex}, ${numRows}`;

    return query;
}

function getCategory() {
    let query = `SELECT * FROM category WHERE deleted = 0 `;

    return query;
}


module.exports = {
    getTotalRecords,
    getLazy,
    getCategory

};