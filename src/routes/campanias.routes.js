import { Router } from "express";
import { methods as vidCampaniasController } from "../controllers/vidCampanias.controller";

const router = Router();

router.get("/", vidCampaniasController.getCampanias);
router.post("/", vidCampaniasController.addCampanias);
router.put("/:id", vidCampaniasController.updateCampanias);
router.delete("/:id", vidCampaniasController.deleteCampanias);
router.get("/detalle/:id", vidCampaniasController.detalleCampania)
router.get("/typesP", vidCampaniasController.todoslostiposPoda)
router.get("/formasFumigacion", vidCampaniasController.formasFumigacion)
router.get("/tiposFumigacion", vidCampaniasController.tiposFumigacion)
router.get("/materialesFumigacion", vidCampaniasController.materialesFumigacion)
router.get("/materialesAbonado", vidCampaniasController.materialesAbonado)
router.get("/tiposCosecha", vidCampaniasController.tiposCosecha)

router.get("/detalle/campania/:id", vidCampaniasController.detalleCampaniaPoda)
router.get("/detalle/campania/fumigacion/:id", vidCampaniasController.detalleCampaniaFumigacion)
router.get("/detalle/campania/abonado/:id", vidCampaniasController.detalleCampaniaAbonado)
router.get("/detalle/campania/cosecha/:id", vidCampaniasController.detalleCampaniaCosecha)

router.post("/poda", vidCampaniasController.addCampaniaPoda)
router.put("/poda/:id", vidCampaniasController.updateCampaniaPoda)


router.post("/riego", vidCampaniasController.addCampaniaRiego)
router.put("/riego/:id", vidCampaniasController.updateCampaniaRiego)

router.post("/fumigacion", vidCampaniasController.addCampaniaFumigacion)
router.put("/fumigacion/:id", vidCampaniasController.updateCampaniaFumigacion)

router.post("/abonado", vidCampaniasController.addCampaniaAbonado)
router.put("/abonado/:id", vidCampaniasController.updateCampaniaAbonado)

router.post("/cosecha", vidCampaniasController.addCampaniaCosecha)
router.put("/cosecha/:id", vidCampaniasController.updateCampaniaCosecha)

export default router;
