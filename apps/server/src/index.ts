import "dotenv/config";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { auth } from "@paircode/auth";
import { toNodeHandler } from "better-auth/node";

const app = express();

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

const server = createServer(app);

const wss = new WebSocketServer({ server });

interface Room {
  sockets: WebSocket[];
}

interface MessageType {
  roomId: string;
  content: string;
  type: "message" | "join" | "leave";
}

const rooms: Record<string, Room> = {};

wss.on("connection", function connection(ws, req) {
  const ip = req.socket.remoteAddress;
  console.log(`New WebSocket connection from ${ip}`);

  ws.on("error", console.error);

  ws.on("message", function message(data) {
    try {
      const parsed: MessageType = JSON.parse(data.toString());
      const { roomId, content, type = "message" } = parsed;

      if (!roomId) {
        console.error("No roomId provided");
        return;
      }

      if (!rooms[roomId]) {
        rooms[roomId] = { sockets: [] };
      }

      if (type === "join") {
        if (!rooms[roomId].sockets.includes(ws)) {
          rooms[roomId].sockets.push(ws);
        }
        return;
      }

      if (type === "message") {
        rooms[roomId].sockets.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ content }));
          }
        });
        return;
      }

      if (type === "leave") {
        rooms[roomId].sockets = rooms[roomId].sockets.filter((s) => s !== ws);
        if (rooms[roomId].sockets.length === 0) {
          delete rooms[roomId];
        }
      }
    } catch (err) {
      console.error("Error processing message:", err);
    }
  });

  ws.on("close", () => {
    for (const roomId in rooms) {
      const room = rooms[roomId];
      if (!room) continue;
      room.sockets = room.sockets.filter((s) => s !== ws);
      if (room.sockets.length === 0) {
        delete rooms[roomId];
      }
    }
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Servers are running on port ${port}`);
});
