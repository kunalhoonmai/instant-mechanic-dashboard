import { Router } from "express";

import {
  getService,
  getServices,
} from "../controllers/service.controller.js";

const router = Router();

router.get("/", getServices);
router.get("/:id", getService);

export default router;