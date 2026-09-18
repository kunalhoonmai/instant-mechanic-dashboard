import type {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  createMechanic,
  getAllMechanics,
  getMechanicById,
  updateMechanic,
  type CreateMechanicInput,
  type UpdateMechanicInput,
} from "../services/mechanic.service.js";

import { getIO } from "../socket/socket.js";

function getParamId(req: Request): string {
  const id = req.params.id;

  if (Array.isArray(id)) {
    return id[0];
  }

  return id;
}

export async function getMechanics(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const mechanics = await getAllMechanics();

    res.status(200).json({
      success: true,
      count: mechanics.length,
      data: mechanics,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMechanic(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const mechanic = await getMechanicById(
      getParamId(req)
    );

    if (!mechanic) {
      res.status(404).json({
        success: false,
        message: "Mechanic not found.",
      });

      return;
    }

    res.status(200).json({
      success: true,
      data: mechanic,
    });
  } catch (error) {
    next(error);
  }
}

export async function createNewMechanic(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input =
      req.body as CreateMechanicInput;

    const requiredFields = [
      "name",
      "phone",
      "specialization",
      "experience",
    ];

    const missingFields =
      requiredFields.filter(
        (field) =>
          input[
            field as keyof CreateMechanicInput
          ] === undefined
      );

    if (missingFields.length > 0) {
      res.status(400).json({
        success: false,
        message:
          "Missing required mechanic fields.",
        fields: missingFields,
      });

      return;
    }

    const mechanic =
      await createMechanic(input);

    getIO().emit(
      "mechanic:created",
      mechanic
    );

    res.status(201).json({
      success: true,
      message:
        "Mechanic created successfully.",
      data: mechanic,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateExistingMechanic(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input =
      req.body as UpdateMechanicInput;

    const mechanic =
      await updateMechanic(
        getParamId(req),
        input
      );

    if (!mechanic) {
      res.status(404).json({
        success: false,
        message: "Mechanic not found.",
      });

      return;
    }

    getIO().emit(
      "mechanic:updated",
      mechanic
    );

    res.status(200).json({
      success: true,
      message:
        "Mechanic updated successfully.",
      data: mechanic,
    });
  } catch (error) {
    next(error);
  }
}