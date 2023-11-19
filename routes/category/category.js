const express = require("express");
const router = express.Router();
const { queryDatabase } = require("../../services/db/query");
const msj = require("../../templates/messages");
const { getTotalRecords, getLazy, getCategory } = require("./query");


router.get("/getLazy", async (req, res) => {
    const { first, rows, globalFilter, sortField, sortOrder } = req.query;
    const startIndex = parseInt(first);
    const numRows = parseInt(rows);
    try {
        const personQuery = await getLazy(startIndex, numRows, globalFilter, sortField, sortOrder);
        const persons = await queryDatabase(personQuery);
        const totalR = await queryDatabase(getTotalRecords())
        const total = totalR[0].totalRecords;

        if (total.length === 0) {
            res.status(404).send({ message: msj.emptyQuery });
        } else {
            res.send({ items: persons, totalRecords: total });
        }
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: msj.errorQuery });
    }
});


router.get("/get", async (req, res) => {
    try {
        const categories = await queryDatabase(getCategory());

        if (categories.length === 0) {
            res.status(404).send({ message: msj.emptyQuery });
        } else {
            res.send(categories);
        }
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: msj.errorQuery });
    }
});


module.exports = router;
