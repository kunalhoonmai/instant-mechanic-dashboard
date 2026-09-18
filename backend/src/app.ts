import cors from "cors";
import express from "express";

import analyticsRoutes from "./routes/analytics.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import mechanicRoutes from "./routes/mechanic.routes.js";
import serviceRoutes from "./routes/service.routes.js";

const app = express();

app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

/* -------------------------------------------------------------------------- */
/* Root                                                                       */
/* -------------------------------------------------------------------------- */

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "🚗 Instant Mechanic API",
    version: "1.0.0",
    status: "running",
  });
});

/* -------------------------------------------------------------------------- */
/* Health                                                                     */
/* -------------------------------------------------------------------------- */

app.get(
  "/api/health",
  (_req, res) => {
    res.status(200).json({
      success: true,
      message:
        "Instant Mechanic API is running",
      timestamp:
        new Date().toISOString(),
    });
  }
);

/* -------------------------------------------------------------------------- */
/* API Routes                                                                 */
/* -------------------------------------------------------------------------- */

app.use(
  "/api/bookings",
  bookingRoutes
);

app.use(
  "/api/mechanics",
  mechanicRoutes
);

app.use(
  "/api/customers",
  customerRoutes
);

app.use(
  "/api/services",
  serviceRoutes
);

app.use(
  "/api/analytics",
  analyticsRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

export default app;