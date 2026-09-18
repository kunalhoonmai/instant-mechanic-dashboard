import type {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  getDashboard,
} from "../services/dashboard.service.js";

export async function getDashboardData(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const dashboard =
      await getDashboard();

    res.status(200).json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    next(error);
  }
}