import "dotenv/config";
import cors from "cors";
import express from "express";
import { createServer } from 'node:http';
import { Server, Socket } from 'socket.io';
import { auth } from "@paircode/auth";
import { toNodeHandler } from "better-auth/node";
import { UserManager } from "./managers/user-managers";
import jwt from "jsonwebtoken";

const app = express();
const server = createServer(app);
const io = new Server(server);
const userManager = new UserManager(io);

app.use(
  cors({
    origin: [
      "https://paircode.live",
      "https://backend.paircode.live",
      ...(process.env.NODE_ENV === 'development' ? ["http://localhost:3000", "http://localhost:3001"] : [])
    ],
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

app.all("/{*path}", (_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Middleware to verify JWT token
io.use((socket: Socket, next) => {
  const token = socket.handshake.query.token as string;
  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    
    if (!JWT_SECRET) {
      return next(new Error("Server configuration error"));
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { 
      email: string; 
      roomId: string;
    };

    if (!decoded || !decoded.email || !decoded.roomId) {
      console.error("Invalid token payload");
      return next(new Error("Authentication error: Invalid token"));
    }

    socket.data.user = {
      email: decoded.email,
      roomId: decoded.roomId,
    };

    console.log(`Authenticated user: ${decoded.email} for room: ${decoded.roomId}`);
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return next(new Error("Authentication error: Invalid token"));
  }
});

io.on("connection", (socket: Socket) => {
  const userData = socket.data.user;
  
  if (!userData) {
    console.error("No user data found after authentication");
    socket.disconnect(true);
    return;
  }

  socket.on("join-room", (roomId: string) => {
    if (!roomId || userData.roomId !== roomId) {
      console.error(`RoomId mismatch: requested ${roomId}, expected ${userData.roomId}`);
      socket.emit("error", { message: "Invalid roomId" });
      socket.disconnect(true);
      return;
    }
    
    userManager.addUser(roomId, socket);
  });

  socket.on("leave-room", (roomId: string) => {
    userManager.removeUser(roomId, socket);
  });

  socket.on("send-message", (data: { roomId: string; content: string }) => {
    if (data.roomId !== userData.roomId) {
      console.error(`Unauthorized message attempt to room ${data.roomId}`);
      socket.emit("error", { message: "Unauthorized" });
      return;
    }
    
    userManager.sendMessage(data.roomId, socket, data.content);
  });

  socket.on("disconnect", (reason) => {
    console.log(`Socket disconnected: ${socket.id}, reason: ${reason}`);
    userManager.removeUser(userData.roomId, socket);
    // leave-room handles cleanup
  });

  socket.on("error", (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
