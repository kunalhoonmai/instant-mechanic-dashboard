import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";

let io: SocketIOServer | null = null;

export function initializeSocket(
  httpServer: HttpServer
): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin:
        process.env.CLIENT_URL ||
        "http://localhost:3000",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(
      `🔌 Socket connected: ${socket.id}`
    );

    socket.on("disconnect", (reason) => {
      console.log(
        `🔌 Socket disconnected: ${socket.id} (${reason})`
      );
    });
  });

  console.log("🔴 Socket.IO initialized");

  return io;
}

export function getIO(): SocketIOServer {
  if (!io) {
    throw new Error(
      "Socket.IO has not been initialized."
    );
  }

  return io;
}