import { Router } from "express";
import { methods as vidMaterialesController } from "../controllers/vidMateriales.controller";

const router = Router();

router.get("/", vidMaterialesController.getMateriales);
router.post("/", vidMaterialesController.addMateriales);
router.put("/:id", vidMaterialesController.updateMateriales);
router.delete("/:id", vidMaterialesController.deleteMateriales);

export default router;
