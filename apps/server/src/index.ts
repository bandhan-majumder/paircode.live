import "dotenv/config";
import cors from "cors";
import express from "express";
import { createServer } from 'node:http';
import { Server, Socket } from 'socket.io';
import { auth } from "@paircode/auth";
import { toNodeHandler } from "better-auth/node";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

app.all("/api/auth{/*path}", toNodeHandler(auth));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});


io.on("connection", (socket: Socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("join-room", (roomId: string) => {
    if (!roomId) {
      socket.emit("error", { message: "No roomId provided" });
      return;
    }
    
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room: ${roomId}`);
    
    socket.to(roomId).emit("user-joined", { 
      socketId: socket.id,
      timestamp: Date.now()
    });
  });

  socket.on("leave-room", (roomId: string) => {
    if (!roomId) {
      socket.emit("error", { message: "No roomId provided" });
      return;
    }
    
    socket.leave(roomId);
    console.log(`Socket ${socket.id} left room: ${roomId}`);
    
    socket.to(roomId).emit("user-left", { 
      socketId: socket.id,
      timestamp: Date.now()
    });
  });

  socket.on("send-message", (data: { roomId: string; content: string }) => {
    const { roomId, content } = data;
    
    if (!roomId) {
      socket.emit("error", { message: "No roomId provided" });
      return;
    }
    
    if (!content) {
      socket.emit("error", { message: "No content provided" });
      return;
    }
    
    // Broadcast to all clients in the room except sender
    socket.to(roomId).emit("receive-message", {
      content,
      senderId: socket.id,
      timestamp: Date.now()
    });
    
    console.log(`Message sent to room ${roomId} from ${socket.id}`);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });

  socket.on("error", (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
