import { Router } from "express";

import {
  createNewMechanic,
  getMechanic,
  getMechanics,
  updateExistingMechanic,
} from "../controllers/mechanic.controller.js";

const router = Router();

router.get("/", getMechanics);
router.get("/:id", getMechanic);
router.post("/", createNewMechanic);
router.patch("/:id", updateExistingMechanic);

export default router;