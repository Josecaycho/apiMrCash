import { Router } from "express";
import { methods as vidVariedadController } from "../controllers/vidVariedad.controller";

const router = Router();

router.get("/", vidVariedadController.getVariedad);
router.post("/", vidVariedadController.addVariedad);
router.put("/:id", vidVariedadController.updateVariedad);
router.delete("/:id", vidVariedadController.deleteVariedad);

export default router;
