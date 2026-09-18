import type {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  getAnalytics,
} from "../services/analytics.service.js";

export async function getAnalyticsData(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const period =
      typeof req.query.period ===
      "string"
        ? req.query.period
        : "week";

    const analytics =
      await getAnalytics(
        period
      );

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
}