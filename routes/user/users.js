const express = require("express");
const router = express.Router();
const msj = require("../../templates/messages");
const bcrypt = require("bcrypt");
const { connectionPromise } = require("../../services/db/db")
const { queryDatabase, queryDatabasePromise } = require("../../services/db/query");
const { getUsers, getLazy, getTotalRecords, insertUser, insertUserRol, updateUser, deleteUser, checkDuplicateUser, checkDuplicateUserRol, checkDuplicateUserRolUpdate, checkDuplicateUserUpdate, getUserById, updateUserRol } = require("./query");

router.get("/get", async (req, res) => {
  try {
    const results = await queryDatabase(getUsers())
    res.send(results);
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
    const personQuery = await getLazy(id, startIndex, numRows, globalFilter, sortField, sortOrder);
    const persons = await queryDatabase(personQuery);
    const totalR = await queryDatabase(getTotalRecords(id))
    const total = totalR[0].totalRecords;

    if (total.length === 0) {
      res.status(404).send({ message: msj.emptyQuery });
    } else {
      res.send({ items: persons, totalRecords: total });
    }
  }catch (err) {
    console.log(err)
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.get("/getById/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id)
  try {
    const results = await queryDatabase(getUserById(id))
    res.send(results);
  } catch (err) {
    console.log(err)
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.post("/post", async (req, res) => {
  const { idperson, idrol, pass, idautor } = req.body;
  let connection;
  try {
    connection = await connectionPromise;
    await connection.beginTransaction();

    const duplicateCheckQuery = await checkDuplicateUser(idperson);
    const duplicateCheckResult = await queryDatabasePromise(connection, duplicateCheckQuery.query, duplicateCheckQuery.values);

    if (duplicateCheckResult.length > 0) {
      res.status(400).send({ message: msj.duplicatedUser });
    } else {
      const insertQuery = await insertUser(idperson, idautor);
      const result = await queryDatabasePromise(connection, insertQuery.query, insertQuery.values);
      const userId = result.insertId;

      await connection.commit(); // Confirmar la transacción para insertar el usuario

      connection.beginTransaction(); // Iniciar una nueva transacción

      const duplicateCheckRolQuery = await checkDuplicateUserRol(userId, idrol);
      const duplicateCheckRolResult = await queryDatabasePromise(connection, duplicateCheckRolQuery.query, duplicateCheckRolQuery.values);

      if (duplicateCheckRolResult.length > 0) {
        res.status(400).send({ message: msj.duplicatedUser });
      } else {
        const hashedPassword = await bcrypt.hashSync(pass, 10);
        const insertRolQuery = await insertUserRol(userId, idrol, hashedPassword, idautor);
        await queryDatabasePromise(connection, insertRolQuery.query, insertRolQuery.values);
        await connection.commit(); // Confirmar la transacción para insertar el rol del usuario
        res.status(200).send({ message: msj.successPost });
      }
    }
  } catch (err) {
    if (connection) {
      await connection.rollback(); // Revertir la transacción en caso de error
      res.status(500).send({ message: msj.errorQuery });
    }
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  const { idperson, idautor} = req.body;

  try {
    const duplicateCheckQuery = await checkDuplicateUserUpdate(idperson, id);
    const duplicateCheckResult = await queryDatabase(duplicateCheckQuery.query, duplicateCheckQuery.values);

    if (duplicateCheckResult.length > 0) {
      res.status(400).send({ message: msj.checkDuplicateUser });
      return;
    }

    const updateQuery = updateUser(id, idperson, idautor);
    await queryDatabase(updateQuery.query, updateQuery.values);
    res.status(200).send({ message: msj.successPut });
  } catch (err) {
    console.log(err)
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.put("/update/rol/:id", async (req, res) => {
  const id = req.params.id;
  const { iduser, idrol, pass, idautor } = req.body;
  let hashedPassword;
  try {
    const duplicateCheckQuery = await checkDuplicateUserRolUpdate(iduser, id);
    const duplicateCheckResult = await queryDatabase(duplicateCheckQuery.query, duplicateCheckQuery.values);

    if (duplicateCheckResult.length > 0) {
      res.status(400).send({ message: msj.checkDuplicateUser });
      return;
    }
    if(pass){
      hashedPassword = bcrypt.hashSync(pass, 10);
    }
    
    const updateQuery = updateUserRol(id, iduser, idrol, hashedPassword, idautor);
    await queryDatabase(updateQuery.query, updateQuery.values);
    res.status(200).send({ message: msj.successPut });
  } catch (err) {
    console.log(err)
    res.status(500).send({ message: msj.errorQuery });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const deleteQuery = deleteUser(id);
    const result = await queryDatabase(deleteQuery.query, deleteQuery.value);

    if (result.affectedRows === 0) {
      res.status(404).send({ message: msj.notFound });
    } else {
      res.status(200).send({ message: msj.successDelete });
    }
  }catch (err) {
    console.log(err)
    res.status(500).send({ message: msj.errorQuery });
  }
});

module.exports = router;
