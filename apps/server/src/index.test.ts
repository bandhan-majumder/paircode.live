import { WebSocket } from "ws";
import http from "http";
import { describe, expect, afterEach, beforeEach, it } from "bun:test";

const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;
const WS_URL = `ws://localhost:${PORT}`;
const HEALTH_URL = `http://localhost:${PORT}/health`;

describe("Test suite for websocket backend", () => {
  let ws1: WebSocket | null = null;
  let ws2: WebSocket | null = null;

  const createWebSocket = (): Promise<WebSocket> => {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(WS_URL);
      
      ws.on("open", () => resolve(ws));
      ws.on("error", reject);
      
      setTimeout(() => reject(new Error("WebSocket connection timeout")), 5000);
    });
  };

  const waitForMessage = (ws: WebSocket, timeout = 5000): Promise<any> => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("Message timeout"));
      }, timeout);

      ws.once("message", (data) => {
        clearTimeout(timer);
        try {
          resolve(JSON.parse(data.toString()));
        } catch (err) {
          resolve(data.toString());
        }
      });
    });
  };

  beforeEach(async () => {
    ws1 = await createWebSocket();
    ws2 = await createWebSocket();
  });

  afterEach(async () => {
    const closePromises: Promise<void>[] = [];
    
    if (ws1 && ws1.readyState === WebSocket.OPEN) {
      closePromises.push(new Promise(resolve => {
        ws1!.once("close", () => resolve());
        ws1!.close();
      }));
    }
    
    if (ws2 && ws2.readyState === WebSocket.OPEN) {
      closePromises.push(new Promise(resolve => {
        ws2!.once("close", () => resolve());
        ws2!.close();
      }));
    }
    
    await Promise.all(closePromises);
    ws1 = null;
    ws2 = null;
    
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  it("should establish WebSocket connections successfully", () => {
    expect(ws1?.readyState).toBe(WebSocket.OPEN);
    expect(ws2?.readyState).toBe(WebSocket.OPEN);
  });

  it("should return health check status", (done) => {
    http.get(HEALTH_URL, (res) => {
      let data = "";
      
      res.on("data", (chunk) => {
        data += chunk;
      });
      
      res.on("end", () => {
        const parsed = JSON.parse(data);
        expect(res.statusCode).toBe(200);
        expect(parsed.status).toBe("ok");
        expect(parsed.uptime).toBeGreaterThan(0);
        done();
      });
    });
  });

  it("should broadcast message to other clients in the same room", async () => {
    if (!ws1 || !ws2) throw new Error("WebSockets not initialized");

    const roomId = "test-room-1";
    const testContent = "Hello from ws1";
    ws1.send(JSON.stringify({ roomId, type: "join" }));
    ws2.send(JSON.stringify({ roomId, type: "join" }));
    
    await new Promise(resolve => setTimeout(resolve, 200));

    const messagePromise = waitForMessage(ws2);

    ws1.send(JSON.stringify({ roomId, content: testContent, type: "message" }));

    const received = await messagePromise;
    expect(received.content).toBe(testContent);
  });

  it("should not send message back to sender", async () => {
    if (!ws1) throw new Error("WebSocket not initialized");

    const roomId = "test-room-2";
    const testContent = "Hello";

    ws1.send(JSON.stringify({ roomId, type: "join" }));
    await new Promise(resolve => setTimeout(resolve, 200));

    let messageReceived = false;
    ws1.on("message", () => {
      messageReceived = true;
    });

    ws1.send(JSON.stringify({ roomId, content: testContent, type: "message" }));

    await new Promise(resolve => setTimeout(resolve, 500));
    expect(messageReceived).toBe(false);
  });

  it("should isolate messages between different rooms", async () => {
    if (!ws1 || !ws2) throw new Error("WebSockets not initialized");

    const ws3 = await createWebSocket();

    try {
      const room1 = "room-1";
      const room2 = "room-2";
      const contentRoom1 = "Message for room 1";

      ws1.send(JSON.stringify({ roomId: room1, type: "join" }));
      ws2.send(JSON.stringify({ roomId: room1, type: "join" }));
      ws3.send(JSON.stringify({ roomId: room2, type: "join" }));

      await new Promise(resolve => setTimeout(resolve, 200));

      const ws2Promise = waitForMessage(ws2);
      const ws3Promise = waitForMessage(ws3, 1000);

      ws1.send(JSON.stringify({ roomId: room1, content: contentRoom1, type: "message" }));

      const ws2Received = await ws2Promise;
      expect(ws2Received.content).toBe(contentRoom1);

      await expect(ws3Promise).rejects.toThrow("Message timeout");
    } finally {
      if (ws3.readyState === WebSocket.OPEN) {
        await new Promise<void>(resolve => {
          ws3.once("close", () => resolve());
          ws3.close();
        });
      }
    }
  });

  it("should handle multiple messages in sequence", async () => {
    if (!ws1 || !ws2) throw new Error("WebSockets not initialized");

    const roomId = "test-room-3";
    const messages = ["Message 1", "Message 2", "Message 3"];
    const receivedMessages: string[] = [];

    ws1.send(JSON.stringify({ roomId, type: "join" }));
    ws2.send(JSON.stringify({ roomId, type: "join" }));
    
    await new Promise(resolve => setTimeout(resolve, 200));

    const ws2Local = ws2;
    if (!ws2Local) throw new Error("WebSocket not initialized");

    const messagePromise = new Promise<void>((resolve) => {
      let count = 0;
      ws2Local.on("message", (data) => {
        const parsed = JSON.parse(data.toString());
        receivedMessages.push(parsed.content);
        count++;
        if (count === messages.length) {
          resolve();
        }
      });
    });

    for (const msg of messages) {
      ws1.send(JSON.stringify({ roomId, content: msg, type: "message" }));
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    await messagePromise;
    expect(receivedMessages).toEqual(messages);
  });

  it("should handle malformed JSON gracefully", async () => {
    if (!ws1) throw new Error("WebSocket not initialized");

    ws1.send("invalid json{");
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    expect(ws1.readyState).toBe(WebSocket.OPEN);
  });

  it("should remove client from room on disconnect", async () => {
    if (!ws1 || !ws2) throw new Error("WebSockets not initialized");

    const ws3 = await createWebSocket();
    const roomId = "test-room-4";

    try {
      ws1.send(JSON.stringify({ roomId, type: "join" }));
      ws2.send(JSON.stringify({ roomId, type: "join" }));
      ws3.send(JSON.stringify({ roomId, type: "join" }));

      await new Promise(resolve => setTimeout(resolve, 200));

      await new Promise<void>(resolve => {
        ws2!.once("close", () => resolve());
        ws2!.close();
      });
      
      await new Promise(resolve => setTimeout(resolve, 200));

      let messageCount = 0;
      ws3.on("message", () => {
        messageCount++;
      });

      ws1.send(JSON.stringify({ roomId, content: "test", type: "message" }));
      await new Promise(resolve => setTimeout(resolve, 300));

      expect(messageCount).toBe(1);
    } finally {
      if (ws3.readyState === WebSocket.OPEN) {
        await new Promise<void>(resolve => {
          ws3.once("close", () => resolve());
          ws3.close();
        });
      }
    }
  });

  it("should handle clients joining room dynamically", async () => {
    if (!ws1 || !ws2) throw new Error("WebSockets not initialized");

    const roomId = "test-room-5";

    ws1.send(JSON.stringify({ roomId, type: "join" }));
    await new Promise(resolve => setTimeout(resolve, 200));

    ws2.send(JSON.stringify({ roomId, type: "join" }));
    await new Promise(resolve => setTimeout(resolve, 200));

    const messagePromise = waitForMessage(ws2);

    ws1.send(JSON.stringify({ roomId, content: "Second message", type: "message" }));

    const received = await messagePromise;
    expect(received.content).toBe("Second message");
  });

  it("should return 404 for unknown routes", (done) => {
    http.get(`${HEALTH_URL.replace('/health', '/unknown')}`, (res) => {
      expect(res.statusCode).toBe(404);
      done();
    });
  });

  it("should handle explicit leave message", async () => {
    if (!ws1 || !ws2) throw new Error("WebSockets not initialized");

    const ws3 = await createWebSocket();
    const roomId = "test-room-6";

    try {
      ws1.send(JSON.stringify({ roomId, type: "join" }));
      ws2.send(JSON.stringify({ roomId, type: "join" }));
      ws3.send(JSON.stringify({ roomId, type: "join" }));

      await new Promise(resolve => setTimeout(resolve, 200));

      ws2.send(JSON.stringify({ roomId, type: "leave" }));
      await new Promise(resolve => setTimeout(resolve, 200));

      let messageCountForws3 = 0;
      let messageCountForws2 = 0;
      
      ws3.on("message", () => {
        messageCountForws3++;
      });

      ws2.on("message", () => {
        messageCountForws3++;
      });

      ws1.send(JSON.stringify({ roomId, content: "test", type: "message" }));

      await new Promise(resolve => setTimeout(resolve, 300));

      expect(messageCountForws3).toBe(1);
      expect(messageCountForws2).toBe(0);
    } finally {
      if (ws3.readyState === WebSocket.OPEN) {
        await new Promise<void>(resolve => {
          ws3.once("close", () => resolve());
          ws3.close();
        });
      }
    }
  });
});