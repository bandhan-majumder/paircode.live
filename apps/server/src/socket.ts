import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import * as dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;
const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", uptime: process.uptime() }));
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

const wss = new WebSocketServer({ server });

interface Room {
  sockets: WebSocket[];
}

interface MessageType {
  roomId: string;
  content: string;
  type: 'message' | 'join' | 'leave';
}

const rooms: Record<string, Room> = {};

wss.on('connection', function connection(ws, req) {
  const ip = req.socket.remoteAddress;
  console.log(`New connection from ${ip}`);

  ws.on('error', console.error);

  ws.on('message', function message(data) {
    try {
      const parsed: MessageType = JSON.parse(data.toString());
      const { roomId, content, type = 'message' } = parsed;

      if (!roomId) {
        console.error('No roomId provided');
        return;
      }

      if (!rooms[roomId]) {
        rooms[roomId] = { sockets: [] };
      }

      
      if (type === 'join') {
        if (!rooms[roomId].sockets.includes(ws)) {
          rooms[roomId].sockets.push(ws);
        }
        return;
      }

      if (type === 'message') {
        rooms[roomId].sockets.forEach(client => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ content }));
          }
        });
        return;
      }

      if (type === 'leave') {
        rooms[roomId].sockets = rooms[roomId].sockets.filter(s => s !== ws);
        if (rooms[roomId].sockets.length === 0) {
          delete rooms[roomId];
        }
      }
    } catch (err) {
      console.error('Error processing message:', err);
    }
  });

  ws.on('close', () => {
    for (const roomId in rooms) {
      const room = rooms[roomId];
      if (!room) continue;
      room.sockets = room.sockets.filter(s => s !== ws);
      if (room.sockets.length === 0) {
        delete rooms[roomId];
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`HTTP + WebSocket server running on port ${PORT}`);
});