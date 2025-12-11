import { io as ioClient, Socket as ClientSocket } from "socket.io-client";
import http from "http";
import { describe, expect, afterEach, beforeEach, it } from "bun:test";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const SOCKET_URL = `http://localhost:${PORT}`;
const HEALTH_URL = `http://localhost:${PORT}/health`;

describe("Test suite for Socket.IO backend", () => {
  let client1: ClientSocket | null = null;
  let client2: ClientSocket | null = null;

  const createSocketClient = (): Promise<ClientSocket> => {
    return new Promise((resolve, reject) => {
      const client = ioClient(SOCKET_URL, {
        transports: ['websocket'],
        reconnection: false,
      });
      
      client.on("connect", () => resolve(client));
      client.on("connect_error", reject);
      
      setTimeout(() => reject(new Error("Socket connection timeout")), 5000);
    });
  };

  const waitForMessage = (client: ClientSocket, event: string, timeout = 5000): Promise<any> => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("Message timeout"));
      }, timeout);

      client.once(event, (data) => {
        clearTimeout(timer);
        resolve(data);
      });
    });
  };

  beforeEach(async () => {
    client1 = await createSocketClient();
    client2 = await createSocketClient();
  });

  afterEach(async () => {
    const closePromises: Promise<void>[] = [];
    
    if (client1 && client1.connected) {
      closePromises.push(new Promise(resolve => {
        client1!.once("disconnect", () => resolve());
        client1!.disconnect();
      }));
    }
    
    if (client2 && client2.connected) {
      closePromises.push(new Promise(resolve => {
        client2!.once("disconnect", () => resolve());
        client2!.disconnect();
      }));
    }
    
    await Promise.all(closePromises);
    client1 = null;
    client2 = null;
    
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  it("should establish Socket.IO connections successfully", () => {
    expect(client1?.connected).toBe(true);
    expect(client2?.connected).toBe(true);
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
    if (!client1 || !client2) throw new Error("Clients not initialized");

    const roomId = "test-room-1";
    const testContent = "Hello from client1";
    
    client1.emit("join-room", roomId);
    client2.emit("join-room", roomId);
    
    await new Promise(resolve => setTimeout(resolve, 200));

    const messagePromise = waitForMessage(client2, "receive-message");

    client1.emit("send-message", { roomId, content: testContent });

    const received = await messagePromise;
    expect(received.content).toBe(testContent);
  });

  it("should not send message back to sender", async () => {
    if (!client1) throw new Error("Client not initialized");

    const roomId = "test-room-2";
    const testContent = "Hello";

    client1.emit("join-room", roomId);
    await new Promise(resolve => setTimeout(resolve, 200));

    let messageReceived = false;
    client1.on("receive-message", () => {
      messageReceived = true;
    });

    client1.emit("send-message", { roomId, content: testContent });

    await new Promise(resolve => setTimeout(resolve, 500));
    expect(messageReceived).toBe(false);
  });

  it("should isolate messages between different rooms", async () => {
    if (!client1 || !client2) throw new Error("Clients not initialized");

    const client3 = await createSocketClient();

    try {
      const room1 = "room-1";
      const room2 = "room-2";
      const contentRoom1 = "Message for room 1";

      client1.emit("join-room", room1);
      client2.emit("join-room", room1);
      client3.emit("join-room", room2);

      await new Promise(resolve => setTimeout(resolve, 200));

      const client2Promise = waitForMessage(client2, "receive-message");
      const client3Promise = waitForMessage(client3, "receive-message", 1000);

      client1.emit("send-message", { roomId: room1, content: contentRoom1 });

      const client2Received = await client2Promise;
      expect(client2Received.content).toBe(contentRoom1);

      await expect(client3Promise).rejects.toThrow("Message timeout");
    } finally {
      if (client3.connected) {
        await new Promise<void>(resolve => {
          client3.once("disconnect", () => resolve());
          client3.disconnect();
        });
      }
    }
  });

  it("should handle multiple messages in sequence", async () => {
    if (!client1 || !client2) throw new Error("Clients not initialized");

    const roomId = "test-room-3";
    const messages = ["Message 1", "Message 2", "Message 3"];
    const receivedMessages: string[] = [];

    client1.emit("join-room", roomId);
    client2.emit("join-room", roomId);
    
    await new Promise(resolve => setTimeout(resolve, 200));

    const client2Local = client2;
    if (!client2Local) throw new Error("Client not initialized");

    const messagePromise = new Promise<void>((resolve) => {
      let count = 0;
      client2Local.on("receive-message", (data) => {
        receivedMessages.push(data.content);
        count++;
        if (count === messages.length) {
          resolve();
        }
      });
    });

    for (const msg of messages) {
      client1.emit("send-message", { roomId, content: msg });
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    await messagePromise;
    expect(receivedMessages).toEqual(messages);
  });

  it("should handle malformed data gracefully", async () => {
    if (!client1) throw new Error("Client not initialized");

    // Send message without roomId
    client1.emit("send-message", { content: "test" });
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    expect(client1.connected).toBe(true);
  });

  it("should remove client from room on disconnect", async () => {
    if (!client1 || !client2) throw new Error("Clients not initialized");

    const client3 = await createSocketClient();
    const roomId = "test-room-4";

    try {
      client1.emit("join-room", roomId);
      client2.emit("join-room", roomId);
      client3.emit("join-room", roomId);

      await new Promise(resolve => setTimeout(resolve, 200));

      await new Promise<void>(resolve => {
        client2!.once("disconnect", () => resolve());
        client2!.disconnect();
      });
      
      await new Promise(resolve => setTimeout(resolve, 200));

      let messageCount = 0;
      client3.on("receive-message", () => {
        messageCount++;
      });

      client1.emit("send-message", { roomId, content: "test" });
      await new Promise(resolve => setTimeout(resolve, 300));

      expect(messageCount).toBe(1);
    } finally {
      if (client3.connected) {
        await new Promise<void>(resolve => {
          client3.once("disconnect", () => resolve());
          client3.disconnect();
        });
      }
    }
  });

  it("should handle clients joining room dynamically", async () => {
    if (!client1 || !client2) throw new Error("Clients not initialized");

    const roomId = "test-room-5";

    client1.emit("join-room", roomId);
    await new Promise(resolve => setTimeout(resolve, 200));

    client2.emit("join-room", roomId);
    await new Promise(resolve => setTimeout(resolve, 200));

    const messagePromise = waitForMessage(client2, "receive-message");

    client1.emit("send-message", { roomId, content: "Second message" });

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
    if (!client1 || !client2) throw new Error("Clients not initialized");

    const client3 = await createSocketClient();
    const roomId = "test-room-6";

    try {
      client1.emit("join-room", roomId);
      client2.emit("join-room", roomId);
      client3.emit("join-room", roomId);

      await new Promise(resolve => setTimeout(resolve, 200));

      client2.emit("leave-room", roomId);
      await new Promise(resolve => setTimeout(resolve, 200));

      let messageCountForClient3 = 0;
      let messageCountForClient2 = 0;
      
      client3.on("receive-message", () => {
        messageCountForClient3++;
      });

      client2.on("receive-message", () => {
        messageCountForClient2++;
      });

      client1.emit("send-message", { roomId, content: "test" });

      await new Promise(resolve => setTimeout(resolve, 300));

      expect(messageCountForClient3).toBe(1);
      expect(messageCountForClient2).toBe(0);
    } finally {
      if (client3.connected) {
        await new Promise<void>(resolve => {
          client3.once("disconnect", () => resolve());
          client3.disconnect();
        });
      }
    }
  });

  it("should receive user-joined notification when client joins room", async () => {
    if (!client1 || !client2) throw new Error("Clients not initialized");

    const roomId = "test-room-7";

    client1.emit("join-room", roomId);
    await new Promise(resolve => setTimeout(resolve, 200));

    const joinPromise = waitForMessage(client1, "user-joined");

    client2.emit("join-room", roomId);

    const received = await joinPromise;
    expect(received.socketId).toBe(client2.id);
  });

  it("should receive user-left notification when client leaves room", async () => {
    if (!client1 || !client2) throw new Error("Clients not initialized");

    const roomId = "test-room-8";

    client1.emit("join-room", roomId);
    client2.emit("join-room", roomId);
    await new Promise(resolve => setTimeout(resolve, 200));

    const leavePromise = waitForMessage(client1, "user-left");

    client2.emit("leave-room", roomId);

    const received = await leavePromise;
    expect(received.socketId).toBe(client2.id);
  });
});