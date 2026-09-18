import { Router } from "express";

import {
  createNewCustomer,
  getCustomer,
  getCustomers,
  updateExistingCustomer,
} from "../controllers/customer.controller.js";

const router = Router();

router.get("/", getCustomers);

router.get("/:id", getCustomer);

router.post("/", createNewCustomer);

router.patch("/:id", updateExistingCustomer);

export default router;