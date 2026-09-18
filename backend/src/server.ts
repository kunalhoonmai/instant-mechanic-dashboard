import "dotenv/config";

import http from "http";

import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { initializeSocket } from "./socket/socket.js";

const PORT =
  Number(process.env.PORT) || 5000;

async function startServer(): Promise<void> {
  await connectDatabase();

  const server = http.createServer(app);

  initializeSocket(server);

  server.listen(PORT, () => {
    console.log("");
    console.log(
      "🚗 Instant Mechanic Backend"
    );
    console.log(
      `🚀 Server running on http://localhost:${PORT}`
    );
    console.log(
      `❤️ Health check: http://localhost:${PORT}/api/health`
    );
    console.log(
      `🔴 Socket.IO ready`
    );
    console.log("");
  });
}

startServer().catch((error) => {
  console.error(
    "❌ Failed to start server"
  );

  if (error instanceof Error) {
    console.error(error.message);
  }

  process.exit(1);
});