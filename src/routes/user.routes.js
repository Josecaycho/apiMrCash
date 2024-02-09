
const express = require("express");
router = express.Router();
const userController = require("../controllers/user.controller");
// const upload = require('../helpers/upload.helper.js');
const connection = require('../../database');
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {fileSize: 10000000000}
})

router.post("/crearUsuario", userController.register)
router.post("/login", userController.login)
router.get("/stateUser/*",verifyToken, userController.stateUser)
router.post("/validateDataUser/*",verifyToken,userController.validateDataUser)
router.post("/validateDataBank",verifyToken, userController.validateDataBank)
router.get("/listBanksUser",verifyToken, userController.listBanksUser)
router.get("/deleteBankUser/*",verifyToken, userController.deleteBankUser)
router.post("/recoverypassword", userController.recoveryPassword)
router.post("/restorepassword", userController.restorePassword)
router.get("/validateDni/*", userController.validateDni)
router.post("/updateUser", verifyToken,  userController.updateDataUser)
router.post("/sendImage", upload.array('file'), verifyToken, userController.sendImageValidate)
router.post("/sendImageOrder/:orden", upload.array('file'), verifyToken, userController.sendImageOrder)
router.post("/generateUrl", userController.generateUrl)
router.get("/listOrders", verifyToken, userController.listOrders)
router.post("/newOrder", verifyToken, userController.newOrder)
router.get("/saveOrder/:orden", verifyToken, userController.finalyOrder)

router.get("/banks", userController.banks)
router.get("/typeAccounts", userController.typeAccounts)

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