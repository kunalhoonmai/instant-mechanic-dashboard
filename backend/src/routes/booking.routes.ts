import { Router } from "express";

import {
  createNewBooking,
  getBooking,
  getBookings,
  removeBooking,
  updateExistingBooking,
} from "../controllers/booking.controller.js";

const router = Router();

router.get("/", getBookings);
router.get("/:id", getBooking);
router.post("/", createNewBooking);
router.patch("/:id", updateExistingBooking);
router.delete("/:id", removeBooking);

export default router;