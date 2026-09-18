import type {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  getAllServices,
  getServiceById,
} from "../services/service.service.js";

export async function getServices(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const services = await getAllServices();

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    next(error);
  }
}

export async function getService(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const service = await getServiceById(id);

    if (!service) {
      res.status(404).json({
        success: false,
        message: "Service not found.",
      });

      return;
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
}