import { Router } from "express";
import { methods as vidFilasController } from "../controllers/vidFilas.controller";

const router = Router();

router.get("/", vidFilasController.getFilas);
router.post("/", vidFilasController.addFilas);
router.put("/:id", vidFilasController.updateFilas);
router.delete("/:id", vidFilasController.deleteFilas);
router.post("/addVariedadfilas", vidFilasController.addVariedadfilas)
router.delete("/deleteFilasVariedad/:id", vidFilasController.deleteFilasVariedad)

export default router;
