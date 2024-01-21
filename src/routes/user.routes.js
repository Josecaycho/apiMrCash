import { Router } from 'express'
import { methods as userController } from "../controllers/user.controller";

const router = Router();

router.post("/crear-usuario", userController.register)
router.post("/login", userController.login)
router.get("/stateUser/*",verifyToken, userController.stateUser)
router.post("/validateDataUser/*",verifyToken, userController.validateDataUser)
router.post("/validateDataBank",verifyToken, userController.validateDataBank)
router.post("/recoverypassword", userController.recoveryPassword)
router.post("/restorepassword", userController.restorePassword)
router.get("/validateDni/*", userController.validateDni)

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

export default router