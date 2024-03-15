
const express = require("express");
router = express.Router();
const adminController = require("../controllers/admin.controller");
// const upload = require('../helpers/upload.helper.js');
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {fileSize: 10000000000}
})

router.get("/users",verifyToken, adminController.users)
router.get("/ordenes",verifyToken, adminController.ordenes)
router.get("/user/:idUser", verifyToken, adminController.userDetail)
router.post("/user/update", verifyToken, adminController.userUpdate)

function verifyToken(req, res, next) {
  const bearearHeader = req.headers['authorization']
  if(typeof bearearHeader !== 'undefined') {
    const bearear = bearearHeader.split(' ')
    const bearearToken = bearear[1]
    req.token = bearearToken
    next()
  }else {
    res.sendStatus(403)
  }
}

module.exports = router