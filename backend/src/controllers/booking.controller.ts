import type {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  createBooking,
  deleteBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  type CreateBookingInput,
  type UpdateBookingInput,
} from "../services/booking.service.js";

import { getIO } from "../socket/socket.js";

function getParamId(
  req: Request
): string {
  const id = req.params.id;

  if (Array.isArray(id)) {
    return id[0];
  }

  return id;
}

export async function getBookings(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const bookings = await getAllBookings();

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
}

export async function getBooking(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const booking = await getBookingById(
      getParamId(req)
    );

    if (!booking) {
      res.status(404).json({
        success: false,
        message: "Booking not found.",
      });

      return;
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
}

export async function createNewBooking(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input =
      req.body as CreateBookingInput;

    const requiredFields = [
      "customerId",
      "serviceId",
      "vehicle",
      "date",
      "time",
      "amount",
    ];

    const missingFields =
      requiredFields.filter(
        (field) =>
          input[
            field as keyof CreateBookingInput
          ] === undefined
      );

    if (missingFields.length > 0) {
      res.status(400).json({
        success: false,
        message:
          "Missing required booking fields.",
        fields: missingFields,
      });

      return;
    }

    const booking =
      await createBooking(input);

    getIO().emit(
      "booking:created",
      booking
    );

    res.status(201).json({
      success: true,
      message:
        "Booking created successfully.",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateExistingBooking(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input =
      req.body as UpdateBookingInput;

    const booking =
      await updateBooking(
        getParamId(req),
        input
      );

    if (!booking) {
      res.status(404).json({
        success: false,
        message: "Booking not found.",
      });

      return;
    }

    getIO().emit(
      "booking:updated",
      booking
    );

    res.status(200).json({
      success: true,
      message:
        "Booking updated successfully.",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
}

export async function removeBooking(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const booking =
      await deleteBooking(
        getParamId(req)
      );

    if (!booking) {
      res.status(404).json({
        success: false,
        message: "Booking not found.",
      });

      return;
    }

    getIO().emit(
      "booking:deleted",
      booking
    );

    res.status(200).json({
      success: true,
      message:
        "Booking deleted successfully.",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
}