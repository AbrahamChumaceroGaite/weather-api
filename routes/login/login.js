const express = require("express");
const router = express.Router();
const { queryDatabase } = require("../../services/db/query");
const msj = require("../../templates/messages");
const { getUser, comparePassword, generateAuthToken, getClient } = require("./query");


router.post('/', async (req, res) => {
  const { ci, pass } = req.body;
  try {
      const userQuery = getUser(ci);
      const [user] = await queryDatabase(userQuery.query, userQuery.value);

      if (user) {
          if (comparePassword(pass, user.pass)) {
              const token = await generateAuthToken({
                  iduser: user.id,
                  name: user.name,
                  rol: user.rol,
              });
              res.json({
                  token,
                  iduser: user.id,
                  name: user.name,
                  rol: user.rol,
              });
          } else {
              res.status(500).json({ message: msj.loginError });
          }
      } else {
          res.status(500).json({ message: msj.loginNoUser });
      }
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: msj.errorQuery });
  }
});

router.post('/client/', async (req, res) => {
    const { ci, pass } = req.body;
    try {
        const userQuery = getClient(ci);
        const [user] = await queryDatabase(userQuery.query, userQuery.value);
  
        if (user) {
            const token = await generateAuthToken({
                iduser: user.id,
                name: user.name,
            });
            res.json({
                token,
                iduser: user.id,
                name: user.name,
            });
        } else {
            res.status(500).json({ message: msj.loginNoUser });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: msj.errorQuery });
    }
  });

module.exports = router;
