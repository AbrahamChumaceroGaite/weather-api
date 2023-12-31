const express = require("express");
const router = express.Router();
const { queryDatabase } = require("../../services/db/query");
const msj = require("../../templates/messages");
const { getDepartments, getDepartmentById, getLazy, getTotalRecords, getTotalUsers, postDepartment, checkExistingDepartment, checkExistingDepartmentUpdate, updateDepartment, deleteDepartment } = require("./query");

router.get("/get", async (req, res) => {
  try {
    const departmentsQuery = getDepartments();
    const departments = await queryDatabase(departmentsQuery);

    if (departments.length === 0) {
      res.status(404).send({ message: msj.notFound });
    } else {
      res.send(departments);
    }
  }catch (err) {
    console.log(err)
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.get("/getLazy", async (req, res) => {
  const { id, first, rows, globalFilter, sortField, sortOrder } = req.query;
  const startIndex = parseInt(first);
  const numRows = parseInt(rows);

  try {
    // Demoprahic query
    const demoprahQuery = await getLazy(id, startIndex, numRows, globalFilter, sortField, sortOrder);
    const demograph = await queryDatabase(demoprahQuery);
    // Total records query
    const { queryTR, valuesTR } = await getTotalRecords(id);
    const totalR = await queryDatabase(queryTR, valuesTR);
    
    // Total users query
    const { queryTU, valuesTU } = await getTotalUsers(id);
    const totalU = await queryDatabase(queryTU, valuesTU);

    // Total records and total users
    const totalRE = totalR[0].totalRecords;
    const totalUS = totalU[0].totalUsers;

    if (totalRE.length === 0) {
      res.status(404).send({ message: msj.emptyQuery });
    } else {
      res.send({ items: demograph, totalRecords: totalRE, totalUsers: totalUS });
    }
  } catch (err) {
    console.log(err)
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.get("/getById/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const { query, value } = getDepartmentById(id);
    const department = await queryDatabase(query, value);

    if (department.length === 0) {
      res.status(404).send({ message: msj.notFound });
    } else {
      res.send(department);
    }
  }catch (err) {
    console.log(err)
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.post("/post", async (req, res) => {
  const {name, idautor} = req.body;

  try {
    // Verificar si el departamento ya existe en la base de datos
    const existingDepartments = await queryDatabase(checkExistingDepartment(name));

    if (existingDepartments.length > 0) {
      res.status(400).send({ message: msj.duplicatedDepartment });
    } else {
      const { query, value } = postDepartment(name, idautor);
      const result = await queryDatabase(query, value);

      if (result.affectedRows === 1) {
        res.status(201).send({ message: msj.successPost });
      } else {
        res.status(500).send({ message: msj.errorQuery });
      }
    }
  }catch (err) {
    console.log(err)
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  const {name, idautor} = req.body;

  try {
    // Verificar si el departamento ya existe en la base de datos
    const existingDepartments = await queryDatabase(checkExistingDepartmentUpdate(name, id));

    if (existingDepartments.length > 0) {
      res.status(400).send({ message: msj.duplicatedDepartment });
    } else {
      const { query, value } = updateDepartment(id, name, idautor);
      const result = await queryDatabase(query, value);

      if (result.affectedRows === 1) {
        res.status(200).send({ message: msj.successPut });
      } else {
        res.status(500).send({ message: msj.errorQuery });
      }
    }
  }catch (err) {
    console.log(err)
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const deleteQuery = deleteDepartment(id);
    const result = await queryDatabase(deleteQuery.query, deleteQuery.value);

    if (result.affectedRows === 1) {
      res.status(200).send({ message: msj.successDelete });
    } else {
      res.status(404).send({ message: msj.notFound });
    }
  }catch (err) {
    console.log(err)
    res.status(500).send({ message: msj.errorQuery });
  }
});

module.exports = router;