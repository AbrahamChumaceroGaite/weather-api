const express = require("express");
const router = express.Router();
const { queryDatabase } = require("../../services/db/query");
const msj = require("../../templates/messages");
const { getTotalRecords, getLazy} = require("./query");


router.get("/getLazy", async (req, res) => {
    const {id, first, rows, globalFilter, sortField, sortOrder } = req.query;
    const startIndex = parseInt(first);
    const numRows = parseInt(rows);
    try {
      const productQuery = await getLazy(id, startIndex, numRows, globalFilter, sortField, sortOrder);
      const product = await queryDatabase(productQuery);
      const totalR = await queryDatabase(getTotalRecords(id))
      const total = totalR[0].totalRecords;
  
      if (total.length === 0) {
        res.status(404).send({ message: msj.emptyQuery });
      } else {
        res.send({ items: product, totalRecords: total });
      }
    }catch (err) {
      console.log(err)
      res.status(500).send({ message: msj.errorQuery });
    }
  });


  module.exports = router;
