import "dotenv/config";
import cors from "cors";
import express from "express";
import { createServer } from 'node:http';
import { Server, Socket } from 'socket.io';
import { auth } from "@paircode/auth";
import { toNodeHandler } from "better-auth/node";
import { UserManager } from "./managers/user-managers";
import { limiter } from "./lib/ratelimiter";

const app = express();
const server = createServer(app);
const io = new Server(server);
const userManager = new UserManager(io);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// rate limit auth route to 100 requests per 15 minutes
app.all("/api/auth{/*path}", limiter, toNodeHandler(auth));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});


io.on("connection", (socket: Socket) => {

  socket.on("join-room", (roomId: string) => {
    userManager.addUser(roomId, socket);
  });

  socket.on("leave-room", (roomId: string) => {
    userManager.removeUser(roomId, socket);
  });

  socket.on("send-message", (data: { roomId: string; content: string }) => {
    userManager.sendMessage(data.roomId, socket, data.content);
  });

  socket.on("disconnect", (reason) => {
    /// leave-room handles cleanup
  });

  socket.on("error", (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
