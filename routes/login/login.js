const express = require("express");
const router = express.Router();
const { queryDatabase } = require("../../services/db/query");
const msj = require("../../utils/messages");
const { getUser, comparePassword, generateAuthToken } = require("./query");


router.post('/', async (req, res) => {
  const { ci, pass } = req.body;
  try {
      const userQuery = getUser(ci);
      const [user] = await queryDatabase(userQuery.query, userQuery.value);

      if (user) {
        console.log("Usuario",user)
          if (comparePassword(pass, user.pass)) {
              const token = await generateAuthToken({
                  iduser: user.id,
                  name: user.name,
                  rol: user.rol,
              });
              console.log("RES: ",res)

              res.json({
                  token,
                  iduser: user.id,
                  name: user.name,
                  rol: user.rol,
              });
          } else {
              res.status(500).json({ mensaje: msj.loginError });
          }
      } else {
          res.status(500).json({ mensaje: msj.loginNoUser });
      }
  } catch (error) {
      console.log(error);
      res.status(500).json({ mensaje: msj.errorQuery });
  }
});




module.exports = router;
