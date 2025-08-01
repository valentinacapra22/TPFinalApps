import express from "express";
import * as enumGeoNamesController from "../controllers/enumGeoNamesController.mjs";

const router = express.Router();

router.route("/pais").get(enumGeoNamesController.getPais);

router.route("/provincia").post(enumGeoNamesController.getProvincia);

router.route("/localidad").post(enumGeoNamesController.getLocalidad);

export default router;
